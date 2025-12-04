const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const JWT_SECRET = "ADMIN_SECRET_KEY";

const adminAuth = async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ message: "Admin token missing" });

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const adminResult = await pool.query(
      "SELECT admin_id, username, role FROM admins WHERE admin_id=$1",
      [decoded.admin_id]
    );

    if (adminResult.rows.length === 0)
      return res.status(401).json({ message: "Admin not found" });

    req.admin = adminResult.rows[0];
    next();
  } catch (err) {
    console.error("Admin auth failed", err);
    return res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = adminAuth;
