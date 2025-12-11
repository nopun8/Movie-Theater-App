-------------------------------------------------------------
-- TABLE: admins
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    admin_id integer PRIMARY KEY,
    username varchar(50) NOT NULL UNIQUE,
    email varchar(100) NOT NULL UNIQUE,
    password_hash text NOT NULL,
    role varchar(50) DEFAULT 'admin',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE IF NOT EXISTS public.admins_admin_id_seq START 1;
ALTER TABLE public.admins 
    ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq');

-------------------------------------------------------------
-- TABLE: booked_seats
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.booked_seats (
    id integer PRIMARY KEY,
    screen_id integer,
    showtime_id integer,
    seat_number integer NOT NULL,
    row_number integer NOT NULL,
    booking_id integer
);

CREATE SEQUENCE IF NOT EXISTS public.booked_seats_id_seq1 START 1;
ALTER TABLE public.booked_seats 
    ALTER COLUMN id SET DEFAULT nextval('public.booked_seats_id_seq1');

-------------------------------------------------------------
-- TABLE: bookings
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    booking_id integer PRIMARY KEY,
    user_id integer,
    showtime_id integer,
    seat_id integer,
    booking_code varchar(50) NOT NULL UNIQUE,
    total_amount numeric(10,2) CHECK (total_amount >= 0),
    status varchar(50) DEFAULT 'pending',
    booking_time timestamp DEFAULT CURRENT_TIMESTAMP,
    expiry_time timestamp,
    qr_code text
);

CREATE SEQUENCE IF NOT EXISTS public.bookings_booking_id_seq START 1;
ALTER TABLE public.bookings 
    ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq');

-------------------------------------------------------------
-- TABLE: movies
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.movies (
    movie_id integer PRIMARY KEY,
    title varchar(150) NOT NULL,
    description text,
    duration_minutes integer CHECK (duration_minutes > 0),
    language varchar(50),
    genre varchar(50),
    rating varchar(10),
    poster_url text,
    trailer_url text,
    release_date date,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE IF NOT EXISTS public.movies_movie_id_seq START 1;
ALTER TABLE public.movies 
    ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq');

-------------------------------------------------------------
-- TABLE: payments
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    payment_id integer PRIMARY KEY,
    booking_id integer,
    amount numeric(10,2) CHECK (amount >= 0),
    payment_method varchar(50),
    transaction_id varchar(100),
    payment_status varchar(50),
    payment_time timestamp DEFAULT CURRENT_TIMESTAMP,
    gateway_response text
);

CREATE SEQUENCE IF NOT EXISTS public.payments_payment_id_seq START 1;
ALTER TABLE public.payments 
    ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq');

-------------------------------------------------------------
-- TABLE: screens
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.screens (
    screen_id integer PRIMARY KEY,
    theater_id integer,
    screen_name varchar(100) NOT NULL,
    total_seats integer NOT NULL CHECK (total_seats > 0),
    total_seats_per_row integer,
    screen_type varchar(50)
);

CREATE SEQUENCE IF NOT EXISTS public.screens_screen_id_seq START 1;
ALTER TABLE public.screens 
    ALTER COLUMN screen_id SET DEFAULT nextval('public.screens_screen_id_seq');

-------------------------------------------------------------
-- TABLE: showtimes
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.showtimes (
    showtime_id integer PRIMARY KEY,
    movie_id integer,
    screen_id integer,
    show_date date NOT NULL,
    show_time time NOT NULL,
    base_price numeric(10,2) CHECK (base_price >= 0),
    available_seats integer CHECK (available_seats >= 0),
    is_active boolean DEFAULT true
);

CREATE SEQUENCE IF NOT EXISTS public.showtimes_showtime_id_seq START 1;
ALTER TABLE public.showtimes 
    ALTER COLUMN showtime_id SET DEFAULT nextval('public.showtimes_showtime_id_seq');

-------------------------------------------------------------
-- TABLE: theaters
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.theaters (
    theater_id integer PRIMARY KEY,
    name varchar(100) NOT NULL,
    address varchar(255),
    city varchar(100),
    state varchar(100),
    postal_code varchar(20),
    phone varchar(20),
    facilities text,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE IF NOT EXISTS public.theaters_theater_id_seq START 1;
ALTER TABLE public.theaters 
    ALTER COLUMN theater_id SET DEFAULT nextval('public.theaters_theater_id_seq');

-------------------------------------------------------------
-- TABLE: users
-------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id integer PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    first_name varchar(200),
    last_name varchar(200)
);

CREATE SEQUENCE IF NOT EXISTS public.users_id_seq START 1;
ALTER TABLE public.users 
    ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq');

-------------------------------------------------------------
-- FOREIGN KEYS (SAFE WITH IF NOT EXISTS)
-------------------------------------------------------------
ALTER TABLE public.screens 
    ADD CONSTRAINT screens_theater_id_fkey
    FOREIGN KEY (theater_id) REFERENCES public.theaters(theater_id) ON DELETE CASCADE;

ALTER TABLE public.showtimes 
    ADD CONSTRAINT showtimes_movie_id_fkey
    FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;

ALTER TABLE public.showtimes 
    ADD CONSTRAINT showtimes_screen_id_fkey
    FOREIGN KEY (screen_id) REFERENCES public.screens(screen_id) ON DELETE CASCADE;

ALTER TABLE public.bookings 
    ADD CONSTRAINT bookings_showtime_id_fkey
    FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id) ON DELETE CASCADE;

ALTER TABLE public.booked_seats 
    ADD CONSTRAINT booked_seats_showtime_id_fkey
    FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id) ON DELETE CASCADE;

ALTER TABLE public.booked_seats 
    ADD CONSTRAINT booked_seats_screen_id_fkey1
    FOREIGN KEY (screen_id) REFERENCES public.screens(screen_id) ON DELETE CASCADE;

ALTER TABLE public.booked_seats 
    ADD CONSTRAINT booked_seats_booking_id_fkey
    FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;

ALTER TABLE public.payments 
    ADD CONSTRAINT payments_booking_id_fkey
    FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;
