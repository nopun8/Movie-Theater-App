const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const authenticate = async (req, res, next) => {
  try {
    // 1. Read token from Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, 'mysecretsignkey-dontleakthis');

    // decoded = { userEmail: "...", iat: 123456 }
    console.log(decoded)
    if (!decoded.userEmail) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // 3. Load user from DB
    const result = await pool.query(
      'SELECT id, email, first_name, last_name FROM users WHERE email = $1',
      [decoded.userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 4. Attach user to req
    req.user = result.rows[0]; // { user_id, email, first_name, last_name }

    next();

  } catch (err) {
    console.error('JWT auth error:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
