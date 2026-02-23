require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Use external database URL if available, otherwise use individual connection params
const connectionConfig = process.env.EXTERNAL_DATABASE_URL 
  ? {
      connectionString: process.env.EXTERNAL_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: process.env.DB_HOST?.includes('dpg-') && !process.env.DB_HOST.includes('.render.com') 
        ? `${process.env.DB_HOST}.oregon-postgres.render.com` 
        : process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_HOST?.includes('render.com') || process.env.DB_HOST?.includes('dpg-') 
        ? { rejectUnauthorized: false } 
        : false
    };

const pool = new Pool(connectionConfig);

async function setupDatabase() {
  console.log('Connecting to Render database...');
  const client = await pool.connect();
  
  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running schema SQL...');
    await client.query(schemaSql);
    
    console.log('✅ Database schema created successfully!');
    
    // Verify tables were created
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\nCreated tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verify categories were inserted
    const categoriesResult = await client.query('SELECT COUNT(*) as count FROM categories');
    console.log(`\nCategories inserted: ${categoriesResult.rows[0].count}`);
    
    // Verify vendor mappings were inserted
    const mappingsResult = await client.query('SELECT COUNT(*) as count FROM vendor_category_mappings');
    console.log(`Vendor mappings inserted: ${mappingsResult.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
