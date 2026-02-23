const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'expense_manager',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function runMigration() {
  try {
    console.log('Connecting to database...');
    
    // Read the migration SQL file
    const sqlFile = path.join(__dirname, 'reset_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Running migration...');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('\nVerifying table structure...');
    
    // Verify the expenses table structure
    const result = await pool.query(`
      SELECT 
        column_name, 
        data_type,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'expenses' 
      ORDER BY ordinal_position
    `);
    
    console.log('\nExpenses table structure:');
    console.table(result.rows);
    
    // Check if category_id exists
    const hasCategoryId = result.rows.some(row => row.column_name === 'category_id');
    if (hasCategoryId) {
      console.log('\n✅ category_id column exists - Schema is correct!');
    } else {
      console.log('\n❌ category_id column NOT found - Migration may have failed');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
