/**
 * Calculates total rental price based on daily rate and date range.
 * Computes number of days between two dates and returns dailyRate * days.
 * Minimum rental duration is 1 day.
 * 
 * @param {number} dailyRate - The daily cost of renting the product
 * @param {string|Date} startDate - Start date of rental
 * @param {string|Date} endDate - End date of rental
 * @returns {number} The calculated total price
 */
function calculateRentalPrice(dailyRate, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get difference in milliseconds
  const diffTime = end - start;

  // Convert milliseconds to days (using Math.ceil to round up partial days)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If start and end are on the same day or invalid range, charge for at least 1 day
  const days = diffDays <= 0 ? 1 : diffDays;

  return Number((dailyRate * days).toFixed(2));
}

module.exports = {
  calculateRentalPrice,
};
