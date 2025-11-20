const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET seat layout + booked seats for a showtime
router.get("/:showtimeId", async (req, res) => {
  const showtimeId = req.params.showtimeId;

  try {
    const layout = await pool.query(
      `SELECT sc.total_seats, sc.total_seats_per_row
       FROM showtimes s
       JOIN screens sc ON s.screen_id = sc.screen_id
       WHERE s.showtime_id = $1`,
      [showtimeId]
    );

    if (layout.rows.length === 0)
      return res.status(404).json({ message: "Showtime not found" });

    const booked = await pool.query(
      `SELECT row_number, seat_number 
       FROM booked_seats 
       WHERE showtime_id = $1`,
      [showtimeId]
    );

    res.json({
      total_seats: layout.rows[0].total_seats,
      total_seats_per_row: layout.rows[0].total_seats_per_row,
      booked: booked.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load seats" });
  }
});


/**
 * POST /api/seats/book
 * Body: {
 *   showtimeId,
 *   seats: [
 *     { row_number, seat_number, age }
 *   ]
 * }
 */
router.post('/book', async (req, res) => {
  const { showtimeId, seats } = req.body;

  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'Invalid seat booking data' });
  }

  try {
    // 1. Get screen + base_price from showtime
    const st = await pool.query(
      `SELECT screen_id, base_price 
       FROM showtimes WHERE showtime_id = $1`,
      [showtimeId]
    );

    if (st.rows.length === 0) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const { screen_id, base_price } = st.rows[0];
    const basePrice = parseFloat(base_price);

    // 2. Price calculation function
    const calculatePrice = (age, basePrice) => {
      if (age <= 12) return basePrice * 0.6;   // 40% discount
      return basePrice;                       // adult price
    };

    let totalAmount = 0;

    await pool.query('BEGIN');

    for (const s of seats) {
      const age = s.age || 20; // default adult
      const seatPrice = calculatePrice(age, basePrice);
      totalAmount += seatPrice;

      // Insert booking
      await pool.query(
        `INSERT INTO booked_seats (screen_id, showtime_id, row_number, seat_number)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT ON CONSTRAINT ux_booked_seats_unique DO NOTHING`,
        [screen_id, showtimeId, s.row_number, s.seat_number]
      );
    }

    await pool.query('COMMIT');

    // Send final calculated price to frontend
    res.json({
      success: true,
      total_amount: totalAmount,
      per_seat_price: basePrice,
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Seat booking error:', err);
    res.status(500).json({ message: 'Booking failed' });
  }
});


module.exports = router; 