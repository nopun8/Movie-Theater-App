const express = require("express");
const { pool } = require("../../db");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

// GET all movies
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies ORDER BY movie_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD movie
router.post("/", adminAuth, async (req, res) => {
  const { title, description, genre, duration_minutes, rating, poster_url, trailer_url, release_date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO movies (title, description, genre, duration_minutes, rating, poster_url, trailer_url, release_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [title, description, genre, duration_minutes, rating, poster_url, trailer_url, release_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE movie
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { title, description, genre } = req.body;

  try {
    const result = await pool.query(
      `UPDATE movies 
       SET title=$1, description=$2, genre=$3 
       WHERE movie_id=$4
       RETURNING *`,
      [title, description, genre, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE movie
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM movies WHERE movie_id=$1", [req.params.id]);
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
