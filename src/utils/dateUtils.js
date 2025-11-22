/**
 * Get today's date in Indian Standard Time (IST, UTC+5:30)
 * Returns a date string in YYYY-MM-DD format
 */
export const getTodayIST = () => {
  const now = new Date();
  // Add IST offset (UTC+5:30 = 330 minutes)
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
  return istTime.toISOString().split('T')[0];
};

/**
 * Get a specific date in IST timezone as YYYY-MM-DD format
 * @param {Date} date - The date to convert
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getDateStringIST = (date) => {
  const istTime = new Date(date.getTime() + (5.5 * 60 * 60 * 1000) - (date.getTimezoneOffset() * 60 * 1000));
  return istTime.toISOString().split('T')[0];
};

/**
 * Normalize a date string to compare dates ignoring time
 * @param {string} dateStr - Date string in YYYY-MM-DD or ISO format
 * @returns {string} - Normalized date string in YYYY-MM-DD format
 */
export const normalizeDateString = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};
