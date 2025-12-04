const express = require("express");
const { pool } = require("../../db");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

/* GET all showtimes */
router.get("/", adminAuth, async (req, res) => {
  try {
    const q = `
      SELECT s.*, m.title AS movie_title, sc.screen_name, t.name AS theater_name
      FROM showtimes s
      JOIN movies m ON s.movie_id = m.movie_id
      JOIN screens sc ON s.screen_id = sc.screen_id
      JOIN theaters t ON sc.theater_id = t.theater_id
      ORDER BY s.show_date DESC, s.show_time DESC`;

    const result = await pool.query(q);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE showtime */
router.post("/", adminAuth, async (req, res) => {
  const { movie_id, screen_id, show_date, show_time, base_price } = req.body;

  try {
    const q = `
      INSERT INTO showtimes (movie_id, screen_id, show_date, show_time, base_price, is_active)
      VALUES ($1,$2,$3,$4,$5,TRUE)
      RETURNING *`;

    const result = await pool.query(q, [
      movie_id, screen_id, show_date, show_time, base_price
    ]);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE showtime */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM showtimes WHERE showtime_id=$1", [req.params.id]);
    res.json({ message: "Showtime deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
