const Expense = require('../models/expense');

class AnomalyDetectionService {
  static async checkAndFlagAnomaly(expenseId, amount, categoryId) {
    const average = await Expense.getAverageByCategory(categoryId);
    
    // If average is 0 or very small, don't flag as anomaly
    if (average === 0 || average < 1) {
      return false;
    }

    // Flag as anomaly if expense is more than 3× the average
    const isAnomaly = amount > (average * 3);
    
    if (isAnomaly) {
      await Expense.updateAnomalyFlag(expenseId, true);
    }
    
    return isAnomaly;
  }

  static async recheckAllAnomalies() {
    // Get all expenses grouped by category
    const expenses = await Expense.getAll();
    const categoryExpenses = {};
    
    // Group expenses by category
    expenses.forEach(exp => {
      if (!categoryExpenses[exp.category_id]) {
        categoryExpenses[exp.category_id] = [];
      }
      categoryExpenses[exp.category_id].push(exp);
    });

    // Calculate averages and flag anomalies
    for (const [categoryId, categoryExps] of Object.entries(categoryExpenses)) {
      const amounts = categoryExps.map(e => parseFloat(e.amount));
      const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      
      if (average > 0) {
        const threshold = average * 3;
        for (const exp of categoryExps) {
          const isAnomaly = parseFloat(exp.amount) > threshold;
          await Expense.updateAnomalyFlag(exp.id, isAnomaly);
        }
      }
    }
  }
}

module.exports = AnomalyDetectionService;
