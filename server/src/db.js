import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(12) NOT NULL,
      score INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_scores_score ON scores (score DESC);`);
}
