CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50) DEFAULT 'admin',
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE public.admins_admin_id_seq START 1;
ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;
ALTER TABLE public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq');

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    first_name character varying(200),
    last_name character varying(200)
);

CREATE SEQUENCE public.users_id_seq START 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq');

CREATE TABLE public.theaters (
    theater_id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(255),
    city character varying(100),
    state character varying(100),
    postal_code character varying(20),
    phone character varying(20),
    facilities text,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE public.theaters_theater_id_seq START 1;
ALTER SEQUENCE public.theaters_theater_id_seq OWNED BY public.theaters.theater_id;
ALTER TABLE public.theaters ALTER COLUMN theater_id SET DEFAULT nextval('public.theaters_theater_id_seq');

CREATE TABLE public.screens (
    screen_id integer NOT NULL,
    theater_id integer,
    screen_name character varying(100) NOT NULL,
    total_seats integer NOT NULL,
    total_seats_per_row integer,
    screen_type character varying(50)
);

CREATE SEQUENCE public.screens_screen_id_seq START 1;
ALTER SEQUENCE public.screens_screen_id_seq OWNED BY public.screens.screen_id;
ALTER TABLE public.screens ALTER COLUMN screen_id SET DEFAULT nextval('public.screens_screen_id_seq');

CREATE TABLE public.movies (
    movie_id integer NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    duration_minutes integer,
    language character varying(50),
    genre character varying(50),
    rating character varying(10),
    poster_url text,
    trailer_url text,
    release_date date,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.movies_movie_id_seq START 1;
ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;
ALTER TABLE public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq');

CREATE TABLE public.showtimes (
    showtime_id integer NOT NULL,
    movie_id integer,
    screen_id integer,
    show_date date NOT NULL,
    show_time time NOT NULL,
    base_price numeric(10,2),
    available_seats integer,
    is_active boolean DEFAULT true
);

CREATE SEQUENCE public.showtimes_showtime_id_seq START 1;
ALTER SEQUENCE public.showtimes_showtime_id_seq OWNED BY public.showtimes.showtime_id;
ALTER TABLE public.showtimes ALTER COLUMN showtime_id SET DEFAULT nextval('public.showtimes_showtime_id_seq');

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    user_id integer,
    showtime_id integer,
    seat_id integer,
    booking_code character varying(50) NOT NULL,
    total_amount numeric(10,2),
    status character varying(50) DEFAULT 'pending',
    booking_time timestamp DEFAULT CURRENT_TIMESTAMP,
    expiry_time timestamp,
    qr_code text
);

CREATE SEQUENCE public.bookings_booking_id_seq START 1;
ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;
ALTER TABLE public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq');

CREATE TABLE public.booked_seats (
    id integer NOT NULL,
    screen_id integer,
    showtime_id integer,
    seat_number integer NOT NULL,
    row_number integer NOT NULL,
    booking_id integer
);

CREATE SEQUENCE public.booked_seats_id_seq1 START 1;
ALTER SEQUENCE public.booked_seats_id_seq1 OWNED BY public.booked_seats.id;
ALTER TABLE public.booked_seats ALTER COLUMN id SET DEFAULT nextval('public.booked_seats_id_seq1');

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    booking_id integer,
    amount numeric(10,2),
    payment_method character varying(50),
    transaction_id character varying(100),
    payment_status character varying(50),
    payment_time timestamp DEFAULT CURRENT_TIMESTAMP,
    gateway_response text
);

CREATE SEQUENCE public.payments_payment_id_seq START 1;
ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;
ALTER TABLE public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq');

-- Foreign Keys
ALTER TABLE public.screens ADD CONSTRAINT screens_theater_id_fkey FOREIGN KEY (theater_id) REFERENCES public.theaters(theater_id) ON DELETE CASCADE;
ALTER TABLE public.showtimes ADD CONSTRAINT showtimes_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;
ALTER TABLE public.showtimes ADD CONSTRAINT showtimes_screen_id_fkey FOREIGN KEY (screen_id) REFERENCES public.screens(screen_id) ON DELETE CASCADE;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_showtime_id_fkey FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id) ON DELETE CASCADE;
ALTER TABLE public.booked_seats ADD CONSTRAINT booked_seats_showtime_id_fkey FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id) ON DELETE CASCADE;
ALTER TABLE public.booked_seats ADD CONSTRAINT booked_seats_screen_id_fkey FOREIGN KEY (screen_id) REFERENCES public.screens(screen_id) ON DELETE CASCADE;
ALTER TABLE public.booked_seats ADD CONSTRAINT booked_seats_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;
ALTER TABLE public.payments ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;

