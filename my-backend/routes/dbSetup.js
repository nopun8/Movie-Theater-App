const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db"); // your PostgreSQL pool

// LOAD the SQL file
const sqlFilePath = path.join(__dirname, "../movie-theater-app.sql");
const sql = fs.readFileSync(sqlFilePath).toString();

// API endpoint to run SQL file
router.get("/init-db", async (req, res) => {
  try {
    const schema = fs.readFileSync(path.join(__dirname, "../schema.sql")).toString();
    await pool.query(schema);
    res.send("✅ All DB tables, sequences & constraints created successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Reset ALL sequences based on existing max values
router.get("/reset-sequences", async (req, res) => {
  try {
    const queries = [
      `SELECT setval('bookings_booking_id_seq', (SELECT COALESCE(MAX(booking_id), 0) + 1 FROM bookings));`,
      `SELECT setval('booked_seats_id_seq1', (SELECT COALESCE(MAX(id), 0) + 1 FROM booked_seats));`,
      `SELECT setval('payments_payment_id_seq', (SELECT COALESCE(MAX(payment_id), 0) + 1 FROM payments));`,
      `SELECT setval('movies_movie_id_seq', (SELECT COALESCE(MAX(movie_id), 0) + 1 FROM movies));`,
      `SELECT setval('screens_screen_id_seq', (SELECT COALESCE(MAX(screen_id), 0) + 1 FROM screens));`,
      `SELECT setval('theaters_theater_id_seq', (SELECT COALESCE(MAX(theater_id), 0) + 1 FROM theaters));`,
      `SELECT setval('showtimes_showtime_id_seq', (SELECT COALESCE(MAX(showtime_id), 0) + 1 FROM showtimes));`,
      `SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM users));`,
      `SELECT setval('admins_admin_id_seq', (SELECT COALESCE(MAX(admin_id), 0) + 1 FROM admins));`
    ];

    for (let q of queries) {
      await pool.query(q);
    }

    res.json({ message: "✅ All sequences have been successfully reset!" });

  } catch (err) {
    console.error("❌ Sequence Reset Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
