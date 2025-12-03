// routes/payments.js
const express = require('express');
const { pool } = require('../db');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

/**
 * POST /api/payments
 * Body: { booking_id, card_number, card_name, expiry, cvv }
 */
router.post('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { booking_id, card_number, card_name, expiry, cvv } = req.body;

  if (!booking_id || !card_number || !card_name) {
    return res.status(400).json({ message: 'Invalid payment data' });
  }

  try {
    // 1. Check booking belongs to user and is PENDING
    const bRes = await pool.query(
      `SELECT booking_id, total_amount, status 
       FROM bookings 
       WHERE booking_id = $1 AND user_id = $2`,
      [booking_id, userId]
    );

    if (bRes.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bRes.rows[0];
    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Booking is not pending' });
    }

    const amount = booking.total_amount;

    // 2. Insert payment (demo only)
    const payRes = await pool.query(
      `INSERT INTO payments (booking_id, amount, payment_method, transaction_id, payment_status, payment_time)
       VALUES ($1, $2, 'CARD', $3, 'SUCCESS', NOW())
       RETURNING payment_id`,
      [booking_id, amount, `PY-${Date.now()}`]
    );

    // 3. Update booking status -> PAID
    await pool.query(
      `UPDATE bookings 
       SET status = 'PAID' 
       WHERE booking_id = $1`,
      [booking_id]
    );

    res.json({
      success: true,
      payment_id: payRes.rows[0].payment_id,
      amount,
    });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ message: 'Payment failed' });
  }
});

module.exports = router;
