/**
 * Date Utility Functions
 * Helper functions for date manipulation and formatting
 */

/**
 * Generate array of next N days starting from today
 * @param {number} count - Number of days to generate
 * @returns {Array} Array of date objects
 */
export const getNextDays = (count = 7) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }

  return days;
};

/**
 * Format date to display format (Mon, 24 Nov 2025)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateDisplay = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
};

/**
 * Format date for date selector (Day name only)
 * @param {Date} date - Date object
 * @returns {string} Day name (e.g., "MON")
 */
export const formatDayName = (date) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[date.getDay()];
};

/**
 * Format date number (e.g., 24)
 * @param {Date} date - Date object
 * @returns {number} Day of month
 */
export const formatDayNumber = (date) => {
  return date.getDate();
};

/**
 * Format month and year (November 2025)
 * @param {Date} date - Date object
 * @returns {string} Month and year
 */
export const formatMonthYear = (date) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

/**
 * Check if date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

/**
 * Format date to ISO string (for storage)
 * @param {Date} date - Date object
 * @returns {string} ISO date string
 */
export const formatDateISO = (date) => {
  return date.toISOString();
};

/**
 * Parse ISO date string to Date object
 * @param {string} isoString - ISO date string
 * @returns {Date} Date object
 */
export const parseDateISO = (isoString) => {
  return new Date(isoString);
};

/**
 * Get days ago text (e.g., "2 days ago")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Days ago text
 */
export const getDaysAgo = (date) => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffTime = Math.abs(today - targetDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

/**
 * Format time countdown (mm:ss)
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatCountdown = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default {
  getNextDays,
  formatDateDisplay,
  formatDayName,
  formatDayNumber,
  formatMonthYear,
  isToday,
  isPastDate,
  formatDateISO,
  parseDateISO,
  getDaysAgo,
  formatCountdown,
};
