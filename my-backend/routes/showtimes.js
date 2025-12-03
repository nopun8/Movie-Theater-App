const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Get all showtimes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.showtime_id,
        sc.screen_name,
        m.title AS movie_title,
        t.name AS theater_name,
        to_char(s.show_date, 'YYYY-MM-DD') AS show_date,
        to_char(s.show_time, 'HH24:MI') AS show_time,
        s.base_price
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN screens sc ON s.screen_id = sc.screen_id
      JOIN theaters t ON sc.theater_id = t.theater_id
      WHERE s.is_active = TRUE
      ORDER BY show_date DESC, show_time DESC
    `);
    console.log(result.rows)
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single showtime
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, 
              m.title AS movie_title,
              t.name  AS theater_name,
              sc.screen_name, sc.total_seats, sc.total_seats_per_row
       FROM showtimes s
       JOIN movies   m  ON s.movie_id = m.movie_id
       JOIN screens  sc ON s.screen_id = sc.screen_id
       JOIN theaters t  ON sc.theater_id = t.theater_id
       WHERE s.showtime_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching showtime', err);
    res.status(500).json({ message: 'Failed to fetch showtime' });
  }
});


module.exports =  router;
