const DELAY_BETWEEN_GROUPS = 10 * 1000; // 10 Seconds
const FETCH_FREQUENCY = 120 * 1000; // Fetch the products every minute
const TIERS_VALUES = {
  high: {
    group: 10,
    fetchFrequency: 120,
    delay: {
      min: 1,
      max: 5,
    },
  },
  medium: {
    group: 5,
    fetchFrequency: 240,
    delay: {
      min: 8,
      max: 12,
    },
  },
  low: {
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
