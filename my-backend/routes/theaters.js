const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM theaters WHERE is_active = TRUE');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, address, city, state, postal_code, phone, facilities } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO theaters (name,address,city,state,postal_code,phone,facilities) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, address, city, state, postal_code, phone, facilities]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
