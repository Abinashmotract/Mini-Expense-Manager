const pool = require('../db/connection');

class VendorMapping {
  static async getAll() {
    const query = `
      SELECT vm.*, c.name as category_name
      FROM vendor_category_mappings vm
      JOIN categories c ON vm.category_id = c.id
      ORDER BY vm.vendor_name
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getByVendorName(vendorName) {
    const query = 'SELECT * FROM vendor_category_mappings WHERE LOWER(vendor_name) = LOWER($1)';
    const result = await pool.query(query, [vendorName]);
    return result.rows[0];
  }

  static async create(vendorName, categoryId) {
    const query = `
      INSERT INTO vendor_category_mappings (vendor_name, category_id)
      VALUES ($1, $2)
      ON CONFLICT (vendor_name) DO UPDATE SET category_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [vendorName, categoryId]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM vendor_category_mappings WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = VendorMapping;
