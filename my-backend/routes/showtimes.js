const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Get all showtimes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.showtime_id, sc.screen_name, m.title AS movie_title, t.name AS theater_name, s.show_date, s.show_time, s.base_price
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN screens sc ON s.screen_id = sc.screen_id
      JOIN theaters t ON sc.theater_id = t.theater_id
      WHERE s.is_active = TRUE
      ORDER BY s.show_date, s.show_time
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports =  router;
