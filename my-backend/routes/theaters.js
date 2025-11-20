const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM theaters WHERE is_active = TRUE');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single theater
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM theaters WHERE theater_id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching theater', err);
    res.status(500).json({ message: 'Failed to fetch theater' });
  }
});

// Screens in a theater
router.get('/:id/screens', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM screens WHERE theater_id = $1 ORDER BY screen_name`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching screens', err);
    res.status(500).json({ message: 'Failed to fetch screens' });
  }
});

// Showtimes in a theater
router.get('/:id/showtimes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.showtime_id, s.show_date, s.show_time, s.base_price,
              m.title AS movie_title,
              sc.screen_name
       FROM showtimes s
       JOIN movies m  ON s.movie_id = m.movie_id
       JOIN screens sc ON s.screen_id = sc.screen_id
       WHERE sc.theater_id = $1
         AND s.is_active = TRUE
       ORDER BY s.show_date, s.show_time`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching theater showtimes', err);
    res.status(500).json({ message: 'Failed to fetch showtimes' });
  }
});

router.post('/', async (req, res) => {
  const { name, address, city, state, postal_code, phone, facilities } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO theaters (name,address,city,state,postal_code,phone,facilities) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, address, city, state, postal_code, phone, facilities]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
