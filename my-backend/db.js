const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',           // Your PostgreSQL username
  host: 'localhost',
  database: 'movieapp',        // Database name created
  password: '1234567890',  // Your PostgreSQL password
  port: 5432,
})
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to database:', err.stack)
  }
  console.log('✅ Connected to PostgreSQL database')
  release()
})

module.exports = { pool }