// routes/bookings.js
const express = require('express');
const { pool } = require('../db');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

/**
 * GET /api/bookings/:id
 * Returns booking + movie/theater/showtime + seats[]
 */
router.get('/details/:id', authenticate, async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT 
          b.booking_id,
          b.booking_code,
          b.total_amount,
          b.status,
          b.booking_time,
          u.first_name,
          u.last_name,
          u.email,
          m.title AS movie_title,
          t.name AS theater_name,
          sc.screen_name,
          s.show_date,
          s.show_time,
          json_agg(
            json_build_object(
              'row_number', bs.row_number,
              'seat_number', bs.seat_number
            )
          ) AS seats
       FROM bookings b
       JOIN users u      ON b.user_id = u.id
       JOIN showtimes s  ON b.showtime_id = s.showtime_id
       JOIN screens sc   ON s.screen_id = sc.screen_id
       JOIN theaters t   ON sc.theater_id = t.theater_id
       JOIN movies m     ON s.movie_id = m.movie_id
       JOIN booked_seats bs ON bs.booking_id = b.booking_id
       WHERE b.booking_id = $1 
         AND b.user_id = $2
       GROUP BY 
          b.booking_id, b.booking_code, b.total_amount, b.status, b.booking_time,
          u.first_name, u.last_name, u.email,
          m.title, t.name, sc.screen_name, s.show_date, s.show_time`,
      [bookingId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

// GET all bookings for logged-in user (simple version)
router.get('/my', authenticate, async (req, res) => {
  const userId = req.user.id || req.user.user_id;

  try {
    // 1️⃣ Get all bookings (one row per booking)
    const bookingsRes = await pool.query(
      `SELECT 
          b.booking_id,
          b.total_amount,
          b.status,
          b.booking_time,
          m.title AS movie_title,
          t.name AS theater_name,
          sc.screen_name,
          s.show_date,
          s.show_time
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.showtime_id
       JOIN screens sc ON s.screen_id = sc.screen_id
       JOIN theaters t ON sc.theater_id = t.theater_id
       JOIN movies m ON s.movie_id = m.movie_id
       WHERE b.user_id = $1
       ORDER BY s.show_date DESC, s.show_time DESC`,
      [userId]
    );

    const bookings = bookingsRes.rows;

    // 2️⃣ For each booking, get seats
    for (let b of bookings) {
      const seatRes = await pool.query(
        `SELECT row_number, seat_number 
         FROM booked_seats 
         WHERE booking_id=$1`,
        [b.booking_id]
      );
      b.seats = seatRes.rows;   // array of seat objects
    }

    res.json(bookings);

  } catch (err) {
    console.error("User bookings error:", err);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
});



module.exports = router;
