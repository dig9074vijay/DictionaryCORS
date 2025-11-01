import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // ✅ required for Render
    : false,
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
