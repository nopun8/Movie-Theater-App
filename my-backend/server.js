require('dotenv').config(); 
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const cors = require('cors')
const { pool } = require('./db.js');
const moviesRoutes = require('./routes/movies');
const theatersRoutes = require('./routes/theaters');
const showtimesRoutes = require('./routes/showtimes');
const seatsRoutes = require('./routes/seats');
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');

const adminAuthRoutes = require('./routes/adminAuth');
const adminMovies = require('./routes/admin/movies');
const adminTheaters = require('./routes/admin/theaters');
const adminScreens = require('./routes/admin/screens');
const adminShowtimes = require('./routes/admin/showtimes');


const app = express()
const PORT = process.env.PORT || 5000

// Secret key for JWT
const JWT_SECRET = "mysecretsignkey-dontleakthis"

app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // for parsing application/json
app.use(passport.initialize()) // Initialize Passport



const users = []

// Configure Passport JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
  // Find user based on the JWT payload
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [jwt_payload.userEmail]
    )

    if (result.rows.length > 0) {
      return done(null, result.rows[0])
    } else {
      return done(null, false)
    }
  } catch (error) {
    return done(error, false)
  }
}))

app.use('/api/movies', moviesRoutes);
app.use('/api/theaters', theatersRoutes);
app.use('/api/showtimes', showtimesRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);

app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/movies", adminMovies);
app.use("/admin/theaters", adminTheaters);
app.use("/admin/screens", adminScreens);
app.use("/admin/showtimes", adminShowtimes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})


/* User registration endpoint.
The data will be in body as JSON:
{
    "userEmail": string,
    "password": string
} */
app.post('/users', async (req, res) => {  // ✅ ADD async
    console.log(req.body)

    const userEmail = req.body.userEmail
    const password = req.body.password

    // Hash password
    const hash = bcrypt.hashSync(password, 10)

    // ✅ ADD: Save to database instead of array
    try {
      await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [userEmail, hash]
      )
      console.log('User registered:', userEmail)
      res.send()
    } catch (error) {
      console.error('Registration error:', error)
      if (error.code === '23505') { // Unique violation
        res.status(400).json({ message: 'User already exists' })
      } else {
        res.status(500).json({ message: 'Registration failed' })
      }
    }
})

app.post('/login', async (req, res) => {
  // here you should validate the incoming request format

  const password = req.body.password
  const userEmail = req.body.userEmail

  try {
    // first check if there is a user with same username
    const userSearchResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [userEmail]
    )

    if (userSearchResult.rows.length === 0) {
      res.sendStatus(404)
      return
    }
    const user = userSearchResult.rows[0]

    // userSearchResult has now a matching user -> next check if the hashes match
    const hashCheckResult = bcrypt.compareSync(password, user.password)
    if(hashCheckResult)
    {
      // yay login successful -> generate a JWT for the user
      const token = jwt.sign({ userEmail: user.email }, JWT_SECRET)
      console.log(token)

      res.json({token: token})
    } else {
      // sad day, login not successful
      res.sendStatus(401)
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
})

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT email, created_at FROM users')
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

// Protected resource using Passport JWT authentication
app.get('/protected-resource',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // If we reach here, the user is authenticated via Passport
    // req.user contains the authenticated user object
    res.json({
      data: "this is the protected or user specific data from this endpoint",
      authenticatedUser: req.user.email
    })
  }
)

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

