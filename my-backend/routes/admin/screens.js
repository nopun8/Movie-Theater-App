const express = require("express");
const { pool } = require("../../db");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

/* GET all screens */
router.get("/", adminAuth, async (req, res) => {
  try {
    const q = `
      SELECT sc.*, t.name AS theater_name
      FROM screens sc
      JOIN theaters t ON sc.theater_id = t.theater_id
      ORDER BY sc.screen_id DESC`;

    const result = await pool.query(q);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE screen */
router.post("/", adminAuth, async (req, res) => {
  const { theater_id, screen_name, total_seats, total_seats_per_row, screen_type } = req.body;

  try {
    const q = `
      INSERT INTO screens (theater_id, screen_name, total_seats, total_seats_per_row, screen_type)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`;

    const result = await pool.query(q, [
      theater_id, screen_name, total_seats, total_seats_per_row, screen_type
    ]);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE screen */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM screens WHERE screen_id=$1", [req.params.id]);
    res.json({ message: "Screen deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
