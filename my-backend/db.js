const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) || 5432,
    ssl: {
      // Required for Azure PostgreSQL
      rejectUnauthorized: true
    },
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to database:', err.stack)
  }
  console.log('✅ Connected to PostgreSQL database')
  release()
})

module.exports = { pool }