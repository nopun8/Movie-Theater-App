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
    await pool.query(sql);
    res.send("✅ Database tables, sequences, constraints, and sample data created successfully!");
  } catch (error) {
    console.error("❌ DB Setup Error:", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = router;
