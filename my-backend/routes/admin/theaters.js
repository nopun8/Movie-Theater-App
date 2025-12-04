const express = require("express");
const { pool } = require("../../db");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

/* ============================
   GET all theaters
============================ */
router.get("/", adminAuth, async (req, res) => {
  try {
    const q = `SELECT * FROM theaters ORDER BY theater_id DESC`;
    const result = await pool.query(q);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   CREATE theater
============================ */
router.post("/", adminAuth, async (req, res) => {
  const { name, address, city, state, postal_code, phone, facilities, is_active } = req.body;

  try {
    const q = `
      INSERT INTO theaters (name, address, city, state, postal_code, phone, facilities, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`;

    const result = await pool.query(q, [
      name, address, city, state, postal_code, phone, facilities, is_active ?? true
    ]);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   UPDATE theater
============================ */
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, postal_code, phone, facilities, is_active } = req.body;

  try {
    const q = `
      UPDATE theaters SET
      name=$1, address=$2, city=$3, state=$4, postal_code=$5,
      phone=$6, facilities=$7, is_active=$8
      WHERE theater_id=$9
      RETURNING *`;

    const result = await pool.query(q, [
      name, address, city, state, postal_code, phone, facilities, is_active, id
    ]);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   DELETE theater
============================ */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM theaters WHERE theater_id=$1", [req.params.id]);
    res.json({ message: "Theater deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
