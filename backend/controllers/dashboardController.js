const Expense = require('../models/expense');

class DashboardController {
  static async getDashboardData(req, res) {
    try {
      const { year, month } = req.query;
      
      const currentDate = new Date();
      const targetYear = year ? parseInt(year) : currentDate.getFullYear();
      const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;

      // Get monthly totals by category
      const monthlyTotals = await Expense.getMonthlyTotalsByCategory(targetYear, targetMonth);

      // Get top 5 vendors
      const topVendors = await Expense.getTopVendors(5);

      // Get anomalies
      const anomalies = await Expense.getAnomalies();
      const anomalyCount = anomalies.length;

      res.json({
        monthlyTotals,
        topVendors,
        anomalies: anomalies.slice(0, 10), // Limit to 10 for display
        anomalyCount
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data', details: error.message });
    }
  }
}

module.exports = DashboardController;
