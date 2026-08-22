import { test as base, expect } from "@playwright/test";
import { calculateTargetDate } from "../helpers/date-utils.js";

/*************************************
 **      Default Values             **
 *************************************/
// if not overwritten by given values, tasks will include these values
const DEFAULT_TASK = {
  action: "add",
  title: `Seed Task Fixture`, // task name
  category: 1, // priority, should be 1-4
  owner: 1, // user, should be 1 or 2
  week_start: 0, // week number, relative to current week
};

/*************************************
 **      Field Transformers         **
 *************************************/
// dynamic values that need to be transformed for the API
const categories = new Map(process.env.PRIORITY_NAMES.split(",").map((item, i) => [i + 1, item]));

const owners = {
  1: process.env.USER_1_NAME,
  2: process.env.USER_2_NAME,
};

function getWeekStart(weekNumber) {
  const dateFormatter = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }); // ex: 2026-08-17
  return dateFormatter.format(calculateTargetDate(weekNumber));
}

const FIELD_TRANSFORMERS = {
  category: (priorityNumber) => categories.get(priorityNumber) || categories.get(1),
  owner: (userNumber) => owners[userNumber] || owners[1],
  week_start: (weekNumber) => getWeekStart(weekNumber) || getWeekStart(0),
};

function resolveTaskReferences(item) {
  return Object.entries(item).reduce((acc, [key, value]) => {
    acc[key] = FIELD_TRANSFORMERS[key] ? FIELD_TRANSFORMERS[key](value) : value;
    return acc;
  }, {});
}

/*************************************
 **      Create Task(s)             **
 *************************************/
export const seedTasks = {
  seedTasks: async ({ request }, use) => {
    //**** 1. GENERATE PAYLOADS FOR EACH TASK  ****
    const createTasks = async (input = 1) => {
      const createdTasks = [];
      let tasksToCreate = [];

      // if only the number of tasks is provided, use the default values
      if (typeof input == "number") {
        tasksToCreate = Array.from({ length: input }, () => ({
          ...DEFAULT_TASK,
          // distinct title using timestamp
          title: `Seed Task Fixture ${Date.now()}`,
        }));
      }
      // if array is provided, merge the provided details with the default values
      else if (Array.isArray(input)) {
        tasksToCreate = input.map((item) => ({
          ...DEFAULT_TASK,
          title: `Seed Task Fixture ${Date.now()}`,
          ...item,
        }));
      }

      //**** 2. MAKE API REQUEST(S) TO GENERATE TASKS  ****
      // Setup: API URL + Access Key
      const appUrl = new URL(process.env.APP_URL);
      const accessKey = appUrl.hash.split("#access_key=")[1];
      if (!accessKey) {
        throw new Error("APP_URL must include #access_key=... for task requests");
      }
      appUrl.hash = "";
      const apiUrl = new URL("api.php", appUrl);
      apiUrl.searchParams.set("access_key", accessKey);

      // Make requests
      for (let payload of tasksToCreate) {
        // add access key to payload
        payload = { ...payload, access_key: accessKey };
        // transform all applicable fields
        payload = resolveTaskReferences(payload);

        // make request
        const response = await request.post(apiUrl.toString(), { data: payload });
        expect(response.ok()).toBeTruthy();

        const created = await response.json();

        createdTasks.push(Object.assign({}, payload, created));
      }
      return createdTasks;
    };

    await use(createTasks);
  },
};

export const test = base.extend(seedTasks);

export { expect };
