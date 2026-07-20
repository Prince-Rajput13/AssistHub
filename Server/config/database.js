const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT 1').catch((err) => {
  console.error('Unable to connect to Postgres:', err.message);
});

pool.on('connect', () => {
  console.log('Connected to Postgres');
});

pool.on('error', (err) => {
  console.error('Unexpected Postgres error', err);
  process.exit(-1);
});

module.exports = pool;
