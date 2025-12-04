const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const router = express.Router();
const JWT_SECRET = "ADMIN_SECRET_KEY";

// ADMIN LOGIN (NO REGISTRATION)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE (username=$1 OR email=$1) AND is_active=TRUE",
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid admin credentials" });

    const admin = result.rows[0];

    const valid = bcrypt.compareSync(password, admin.password_hash);
    if (!valid)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { admin_id: admin.admin_id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
