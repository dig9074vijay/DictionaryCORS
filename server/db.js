import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// create a pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
  ssl: true,
});

// initialize table
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS words (
      word TEXT PRIMARY KEY,
      meaning JSONB
    );
  `);
  console.log('✅ Database initialized');
}

initDB();

export default pool;
