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

module.exports = router;
