const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET all movies
router.get('/old', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies WHERE is_active = TRUE ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET all movies with theater, screen, and next showtime
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.movie_id,
        m.title,
        m.genre,
        m.rating,
        m.duration_minutes,
        m.poster_url,
        m.release_date,
        t.name AS theater_name,
        sc.screen_name,
        MIN(s.show_date) AS next_show_date,
        MIN(s.show_time) AS next_show_time
      FROM movies m
      LEFT JOIN showtimes s ON m.movie_id = s.movie_id
      LEFT JOIN screens sc ON s.screen_id = sc.screen_id
      LEFT JOIN theaters t ON sc.theater_id = t.theater_id
      WHERE m.is_active = TRUE
      GROUP BY m.movie_id, t.name, sc.screen_name
      ORDER BY m.movie_id ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Movie not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD new movie (admin)
router.post('/', async (req, res) => {
  const { title, description, duration_minutes, genre, rating, poster_url, trailer_url, release_date } = req.body;
  try {
    const query = `
      INSERT INTO movies (title, description, duration_minutes, genre, rating, poster_url, trailer_url, release_date)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const result = await pool.query(query, [title, description, duration_minutes, genre, rating, poster_url, trailer_url, release_date]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
