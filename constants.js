const DELAY_BETWEEN_GROUPS = 10 * 1000; // 10 Seconds
const FETCH_FREQUENCY = 120 * 1000; // Fetch the products every minute
const WORKER_GROUP_LENGTH = 10;
const TIERS_VALUES = {
  1: {
    group: 10,
    fetchFrequency: 120,
    delay: {
      min: 1,
      max: 5,
    },
  },
  2: {
    group: 5,
    fetchFrequency: 240,
    delay: {
      min: 8,
      max: 12,
    },
  },
  3: {
    group: 2,
    fetchFrequency: 360,
    delay: {
      min: 15,
      max: 30,
    },
  },
};

module.exports = {
  TIERS_VALUES,
  DELAY_BETWEEN_GROUPS,
  FETCH_FREQUENCY,
};
