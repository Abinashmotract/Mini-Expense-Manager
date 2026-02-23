const pool = require('../db/connection');

class Category {
  static async getAll() {
    const query = 'SELECT * FROM categories ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getByName(name) {
    const query = 'SELECT * FROM categories WHERE name = $1';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async create(name) {
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }
}

module.exports = Category;
