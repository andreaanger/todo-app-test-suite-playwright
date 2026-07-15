const ONE_WEEK_IN_MS = 604800000; // (7 days * 24 hours * 60 mins * 60 secs * 1000 ms)
const WEEK_ONE_START_TIME = new Date(process.env.WEEK_ONE_START_DATE).getTime();
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });

/**
 * Get Today's date at midnight
 *
 * @returns {Date} Date of the current date at midnight
 */
function getTodayDate() {
  return new Date(new Date().setHours(0, 0, 0, 0));
}

/**
 * Calculates the first day of a week relative to the current week.
 *
 * @param {number} weekOffset - The number of weeks to look ahead or behind.
 *   - Use `0` for the current week.
 *   - Use negative numbers for past weeks (ex: `-1` for last week)
 *   - Use positive numbers for future weeks (ex: `1` for next week)
 * @returns {Date} The date of the first day of that week
 */
function calculateTargetDate(weekOffset) {
  // start from todays date
  let targetDate = getTodayDate();

  // Apply the week offset by adding/subtracting weeks in milliseconds
  return targetDate.setTime(targetDate.getTime() + weekOffset * ONE_WEEK_IN_MS);
}

/**
 * Calculates the week number in relation to the start date (Week 1)
 *
 * @param {number} targetDateMs - The date in milliseconds that the week begins
 * @returns {number} The week number that the target date is, in relation to the start date (Week 1)
 */
function calculateWeekNumber(targetDateMs) {
  // Calculate the difference in time between the target date and Week 1
  const diffInMs = targetDateMs - WEEK_ONE_START_TIME;

  // Convert milliseconds to weeks, round down, and add 1 (since we start at Week 1)
  return Math.floor(diffInMs / ONE_WEEK_IN_MS) + 1;
}

/**
 * Calculates the date range of the week in which the target date occurs.
 * The week is Monday - Sunday.
 *
 * @param {number} targetDateMs - The date in milliseconds that the week begins
 * @returns {string} The range of dates for the week in which the target date occurs.
 * (Ex:"August 3 - August 9")
 */
function calculateWeekDateRange(targetDateMs) {
  const targetDate = new Date(targetDateMs);
  // Find how many days we need to subtract to get back to Monday
  const currentDayOfWeek = targetDate.getDay();
  const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Calculate Monday (Start of the Week)
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - daysToSubtract);

  // Calculate Sunday (End of the Week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  // Format the dates
  const startFormatted = dateFormatter.format(monday);
  const endFormatted = dateFormatter.format(sunday);

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Generates the formatted week details of a week relative to the current week.
 *
 * @param {number} weekOffset - The number of weeks to look ahead or behind.
 *   - Use `0` for the current week.
 *   - Use negative numbers for past weeks (ex: `-1` for last week)
 *   - Use positive numbers for future weeks (ex: `1` for next week)
 * @returns {string} The formatted week details (ex: "Week 6 • July 13 - July 19")
 */
export function generateExpectedWeekLabel(weekOffset) {
  const targetDate = calculateTargetDate(weekOffset);
  const week = calculateWeekNumber(targetDate);
  const dates = calculateWeekDateRange(targetDate);

  return `Week ${week} • ${dates}`;
}

/**
 * Calculates the week number relative to the current week.
 *
 * @param {number} weekOffset - The number of weeks to look ahead or behind.
 *   - Use `0` for the current week
 *   - Use negative numbers for past weeks (ex: `-1` for last week)
 *   - Use positive numbers for future weeks (ex: `1` for next week)
 * @returns {number} The week number of that week
 */
export function getExpectedWeek(weekOffset) {
  return calculateWeekNumber(calculateTargetDate(weekOffset));
}

/**
 * Calculates the date range of a week relative to the current week.
 *
 * @param {number} weekOffset - The number of weeks to look ahead or behind.
 *   - Use `0` for the current week.
 *   - Use negative numbers for past weeks (ex: `-1` for last week)
 *   - Use positive numbers for future weeks (ex: `1` for next week)
 * @returns {string} The formatted date range of that week (ex: "August 3 - August 9")
 */
export function getExpectedDateRange(weekOffset) {
  return calculateWeekDateRange(calculateTargetDate(weekOffset));
}
