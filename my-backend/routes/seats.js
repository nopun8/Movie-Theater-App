const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Get booked seats for a showtime
router.get('/:showtimeId', async (req, res) => {
  const showtimeId = req.params.showtimeId;
  try {
    const query = `
      SELECT bs.seat_number, bs.row_number
      FROM booked_seats bs
      JOIN screens sc ON bs.screen_id = sc.screen_id
      JOIN showtimes s ON s.screen_id = sc.screen_id
      WHERE s.showtime_id = $1
    `;
    const result = await pool.query(query, [showtimeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports =  router;
