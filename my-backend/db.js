const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',  
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'movie-theater-app', 
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
})
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to database:', err.stack)
  }
  console.log('✅ Connected to PostgreSQL database')
  release()
})

module.exports = { pool }