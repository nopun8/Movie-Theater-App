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

// INSERT DATA
router.get("/insert-data", async (req, res) => {
  try {
    //
    // ADMINS
    //
    await pool.query(`
      INSERT INTO admins (admin_id, username, email, password_hash, role, created_at, is_active)
      VALUES
      (1, 'admin', 'admin@cinema.com',
       '$2a$06$IRnCXMcnU0rKVV47FinuqOvaN4AhQlDuYjpeGQkeB91RNm1c6jFJe',
       'SUPERADMIN', '2025-12-02 20:56:21.374156', TRUE),
      (2, 'admin2', 'admin@admin.com',
       '$2a$06$ILyv0Sl3hOY12wlc8wX9/.3i4N6YzaVj8ol0etSdLDpdN39reqesW',
       'SUPERADMIN', '2025-12-03 03:58:32.238169', TRUE);
    `);

    //
    // USERS
    //
    await pool.query(`
      INSERT INTO users (id, email, password, created_at, first_name, last_name)
      VALUES
      (1, 'admin@admin.com',
       '$2b$10$CCq0btPtcAt2FqXF3qBPd.JcvF0RwDLFTUUtdGe0xZXpWd9yrHFtW',
       '2025-11-06 18:05:52.515285', NULL, NULL);
    `);

    //
    // THEATERS
    //
    await pool.query(`
      INSERT INTO theaters (theater_id, name, address, city, state, postal_code, phone, facilities, is_active)
      VALUES
      (1, 'North Star Cinema', '123 Aurora Street', 'Oulu', 'Northern Ostrobothnia', '90100',
       '+358401234567', '3D Projection, Dolby Atmos, Snack Bar', TRUE),

      (2, 'Oulu Central Theater', '45 Rotuaari Street', 'Oulu', 'Northern Ostrobothnia', '90100',
       '+358409998877', '4K Projection, Dolby Surround, Snack Bar, Recliner Seats', TRUE),

      (3, 'North Star Cinema', '123 Aurora Street', 'Oulu', 'Northern Ostrobothnia', '90100',
       '+358401234567', '3D Projection, Dolby Atmos, Snack Bar', TRUE);
    `);

    //
    // SCREENS
    //
    await pool.query(`
      INSERT INTO screens (screen_id, theater_id, screen_name, total_seats, total_seats_per_row, screen_type)
      VALUES
      (1, 1, 'Screen 1', 50, 10, 'IMAX'),
      (2, 2, 'Screen 2', 50, 10, '4K Digital'),
      (3, 1, 'Screen 1', 50, 10, 'IMAX');
    `);

    //
    // MOVIES
    //
    await pool.query(`
      INSERT INTO movies (movie_id, title, description, duration_minutes, language, genre, rating,
                          poster_url, trailer_url, release_date, is_active, created_at)
      VALUES
      (1, 'Inception',
       'A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his criminal history.',
       148, 'English', 'Sci-Fi', 'PG-13',
       'https://images.moviesanywhere.com/e7e6741dd8d06aa686a375d36b93ee65/5846c52b-6cdc-485c-b994-1c71027227c1.jpg?r=3x1&w=2400',
       'https://www.youtube.com/watch?v=YoHD9XEInc0',
       '2010-07-16', TRUE, '2025-11-13 02:43:30.206951'),

      (2, 'Spider-Man: Homecoming',
       'Peter Parker balances life as an ordinary high school student with his superhero alter-ego Spider-Man, as he faces the villain Vulture.',
       133, 'English', 'Action', 'PG-13',
       'https://upload.wikimedia.org/wikipedia/en/f/f9/Spider-Man_Homecoming_poster.jpg',
       'https://www.youtube.com/watch?v=39udgGPyYMg',
       '2017-07-07', TRUE, '2025-11-13 21:38:01.736006'),

      (4, 'Avengers: Secret Wars',
       'Earth’s Mightiest Heroes face their greatest multiversal threat in the final chapter of the Multiverse Saga.',
       160, 'English', 'Action, Sci-Fi, Adventure', 'PG-13',
       'https://image.tmdb.org/t/p/original/your_upcoming_movie_poster.jpg',
       'https://www.youtube.com/watch?v=your_trailer_link',
       '2026-05-02', TRUE, '2025-11-19 01:08:03.344463'),

      (5, 'Interstellar',
       NULL, NULL, NULL, 'Adventure, Sci-Fi', '7.6',
       'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg',
       NULL, '2025-12-03', TRUE, '2025-12-03 04:35:27.239767'),

      (6, 'Avenger Endgame',
       NULL, 155, NULL, 'Action', '9',
       'https://www.hdwallpapers.in/download/avengers_endgame_official_poster_4k-2560x1440.jpg',
       NULL, '2021-08-01', TRUE, '2025-12-04 22:37:25.207871');
    `);

    //
    // SHOWTIMES
    //
    await pool.query(`
      INSERT INTO showtimes (showtime_id, movie_id, screen_id, show_date, show_time, base_price, available_seats, is_active)
      VALUES
      (1, 1, 1, '2025-12-20', '18:00:00', 12.50, 40, TRUE),
      (2, 2, 2, '2025-12-20', '20:30:00', 14.00, 40, TRUE),
      (3, 1, 1, '2025-12-20', '18:00:00', 12.50, 40, TRUE),
      (4, 1, 1, '2025-12-20', '18:00:00', 12.90, NULL, TRUE),
      (5, 1, 1, '2025-12-20', '21:00:00', 12.90, NULL, TRUE),
      (6, 2, 2, '2025-12-20', '17:00:00', 14.50, NULL, TRUE),
      (7, 2, 2, '2025-12-20', '20:00:00', 14.50, NULL, TRUE),
      (8, 1, 1, '2025-12-20', '21:00:00', 12.90, NULL, TRUE);
    `);

    //
    // BOOKINGS
    //
    await pool.query(`
      INSERT INTO bookings (booking_id, user_id, showtime_id, seat_id, booking_code, total_amount, status, booking_time, expiry_time, qr_code)
      VALUES
      (2, 1, 8, NULL, 'S1MD5E', 20.64, 'PAID', '2025-11-27 02:04:20.774778', NULL, NULL),
      (3, 1, 8, NULL, 'LQGGNI', 12.90, 'PAID', '2025-11-27 02:55:27.965874', NULL, NULL),
      (4, 1, 7, NULL, '3ZYUHA', 14.50, 'PAID', '2025-11-27 22:05:57.001276', NULL, NULL),
      (5, 1, 2, NULL, 'MT6BZ4', 14.00, 'PAID', '2025-12-04 22:40:05.673273', NULL, NULL),
      (6, 1, 7, NULL, '16M76U', 14.50, 'PAID', '2025-12-05 10:45:08.227155', NULL, NULL);
    `);

    //
    // PAYMENTS
    //
    await pool.query(`
      INSERT INTO payments (payment_id, booking_id, amount, payment_method, transaction_id, payment_status, payment_time)
      VALUES
      (1, 2, 20.64, 'CARD', 'PY-1764202119187', 'SUCCESS', '2025-11-27 02:08:39.190062'),
      (2, 3, 12.90, 'CARD', 'PY-1764205137320', 'SUCCESS', '2025-11-27 02:58:57.321265'),
      (3, 4, 14.50, 'CARD', 'PY-1764274009335', 'SUCCESS', '2025-11-27 22:06:49.338226'),
      (4, 5, 14.00, 'CARD', 'PY-1764880851470', 'SUCCESS', '2025-12-04 22:40:51.472211'),
      (5, 6, 14.50, 'CARD', 'PY-1764924339147', 'SUCCESS', '2025-12-05 10:45:39.150944');
    `);

    //
    // BOOKED SEATS
    //
    await pool.query(`
      INSERT INTO booked_seats (id, screen_id, showtime_id, seat_number, row_number, booking_id)
      VALUES
      (1, 1, 8, 1, 1, 2),
      (2, 1, 8, 2, 1, 2),
      (3, 1, 8, 3, 1, 3),
      (4, 2, 7, 4, 2, 4),
      (5, 2, 2, 7, 3, 5),
      (6, 2, 7, 5, 4, 6);
    `);

    return res.json({ message: "✅ All data inserted successfully!" });

  } catch (err) {
    console.error("❌ INSERT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
