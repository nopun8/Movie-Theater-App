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

// UPCOMING MOVIES: release_date in future
router.get('/upcoming/list', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM movies
       WHERE is_active = TRUE
         AND release_date > CURRENT_DATE
       ORDER BY release_date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching upcoming movies', err);
    res.status(500).json({ message: 'Failed to fetch upcoming movies' });
  }
});

// SEARCH + FILTER
// /api/movies/search?q=bat&genre=Action&rating=PG-13
router.get('/search', async (req, res) => {
  const { q, genre, rating, language } = req.query;

  let sql = `SELECT * FROM movies WHERE is_active = TRUE`;
  const params = [];

  if (q) {
    params.push(`%${q}%`);
    sql += ` AND title ILIKE $${params.length}`;
  }

  if (genre) {
    const genresArray = genre.split(',').map(g => g.trim());
    const genreConditions = genresArray.map((g, i) => {
      params.push(`%${g}%`);
      return `genre ILIKE $${params.length}`;
    });
    sql += ` AND (${genreConditions.join(' OR ')})`;
  }

  if (rating) {
    params.push(rating);
    sql += ` AND rating = $${params.length}`;
  }

  if (language) {
    params.push(language);
    sql += ` AND language = $${params.length}`;
  }

  sql += ` ORDER BY release_date DESC, movie_id DESC`;

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching movies', err);
    res.status(500).json({ message: 'Failed to search movies' });
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


// SHOWTIMES FOR A MOVIE
router.get('/:id/showtimes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.showtime_id, s.base_price,
              t.name AS theater_name,
              sc.screen_name,
              m.title AS movie_title,
              to_char(s.show_date, 'YYYY-MM-DD') AS show_date,
              to_char(s.show_time, 'HH24:MI') AS show_time,
              (CASE
                  WHEN (s.show_date > CURRENT_DATE)
                    OR (s.show_date = CURRENT_DATE AND s.show_time >= CURRENT_TIME)
                  THEN TRUE
                  ELSE FALSE
              END) AS is_upcoming
       FROM showtimes s
       JOIN movies m  ON s.movie_id = m.movie_id
       JOIN screens sc ON s.screen_id = sc.screen_id
       JOIN theaters t ON sc.theater_id = t.theater_id
       WHERE s.movie_id = $1
         AND s.is_active = TRUE
       ORDER BY show_date DESC, show_time DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting movie showtimes', err);
    res.status(500).json({ message: 'Failed to fetch showtimes' });
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
