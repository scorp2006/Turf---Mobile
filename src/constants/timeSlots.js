/**
 * Time Slots Configuration
 * Defines time periods and their corresponding slots
 */

export const TIME_PERIODS = {
  MORNING: 'Morning',
  NOON: 'Noon',
  EVENING: 'Evening',
  TWILIGHT: 'Twilight',
};

export const PERIOD_CONFIG = {
  [TIME_PERIODS.MORNING]: {
    label: 'Morning',
    icon: 'sunny-outline',
    iconFamily: 'Ionicons',
    startTime: 6,
    endTime: 12,
    displayTime: '06:00 AM - 12:00 PM',
  },
  [TIME_PERIODS.NOON]: {
    label: 'Noon',
    icon: 'sunny',
    iconFamily: 'Ionicons',
    startTime: 12,
    endTime: 16,
    displayTime: '12:00 PM - 04:00 PM',
  },
  [TIME_PERIODS.EVENING]: {
    label: 'Evening',
    icon: 'partly-sunny-outline',
    iconFamily: 'Ionicons',
    startTime: 16,
    endTime: 20,
    displayTime: '04:00 PM - 08:00 PM',
  },
  [TIME_PERIODS.TWILIGHT]: {
    label: 'Twilight',
    icon: 'moon-outline',
    iconFamily: 'Ionicons',
    startTime: 20,
    endTime: 23,
    displayTime: '08:00 PM - 11:00 PM',
  },
};

/**
 * Generate time slots for a given period
 * @param {string} period - Time period key (MORNING, NOON, etc.)
 * @returns {Array} Array of time slot strings
 */
export const generateTimeSlots = (period) => {
  const config = PERIOD_CONFIG[period];
  if (!config) return [];

  const slots = [];
  for (let hour = config.startTime; hour < config.endTime; hour++) {
    const nextHour = hour + 1;
    const startAMPM = hour < 12 ? 'AM' : 'PM';
    const endAMPM = nextHour < 12 ? 'AM' : 'PM';
    const start12Hour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const end12Hour = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;

    slots.push(
      `${String(start12Hour).padStart(2, '0')}:00 ${startAMPM} - ${String(end12Hour).padStart(2, '0')}:00 ${endAMPM}`
    );
  }

  return slots;
};

/**
 * Get available slot count for a period
 * @param {string} period - Time period key
 * @returns {number} Number of available slots
 */
export const getSlotCount = (period) => {
  const config = PERIOD_CONFIG[period];
  if (!config) return 0;
  return config.endTime - config.startTime;
};

export default {
  TIME_PERIODS,
  PERIOD_CONFIG,
  generateTimeSlots,
  getSlotCount,
};
