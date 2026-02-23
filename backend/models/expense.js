const pool = require('../db/connection');

class Expense {
  static async create({ date, amount, vendor_name, description, category_id, is_anomaly = false }) {
    const query = `
      INSERT INTO expenses (date, amount, vendor_name, description, category_id, is_anomaly)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [date, amount, vendor_name, description, category_id, is_anomaly]);
    return result.rows[0];
  }

  static async getAll() {
    const query = `
      SELECT e.*, c.name as category_name
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      ORDER BY e.date DESC, e.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getByDateRange(startDate, endDate) {
    const query = `
      SELECT e.*, c.name as category_name
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.date >= $1 AND e.date <= $2
      ORDER BY e.date DESC
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  static async getAnomalies() {
    const query = `
      SELECT e.*, c.name as category_name
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.is_anomaly = true
      ORDER BY e.date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getMonthlyTotalsByCategory(year, month) {
    const query = `
      SELECT c.name as category, SUM(e.amount) as total
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE EXTRACT(YEAR FROM e.date) = $1 AND EXTRACT(MONTH FROM e.date) = $2
      GROUP BY c.name
      ORDER BY total DESC
    `;
    const result = await pool.query(query, [year, month]);
    return result.rows;
  }

  static async getTopVendors(limit = 5) {
    const query = `
      SELECT vendor_name, SUM(amount) as total_spend, COUNT(*) as transaction_count
      FROM expenses
      GROUP BY vendor_name
      ORDER BY total_spend DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async getAverageByCategory(categoryId) {
    const query = `
      SELECT AVG(amount) as average
      FROM expenses
      WHERE category_id = $1
    `;
    const result = await pool.query(query, [categoryId]);
    return parseFloat(result.rows[0]?.average || 0);
  }

  static async updateAnomalyFlag(expenseId, isAnomaly) {
    const query = `
      UPDATE expenses
      SET is_anomaly = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [isAnomaly, expenseId]);
    return result.rows[0];
  }
}

module.exports = Expense;
