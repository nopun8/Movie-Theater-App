--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-12-11 02:43:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16544)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 221 (class 1259 OID 16402)
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    admin_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50) DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


--
-- TOC entry 220 (class 1259 OID 16401)
-- Name: admins_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 220
-- Name: admins_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_admin_id_seq OWNED BY public.admins.admin_id;


--
-- TOC entry 235 (class 1259 OID 16522)
-- Name: booked_seats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booked_seats (
    id integer NOT NULL,
    screen_id integer,
    showtime_id integer,
    seat_number integer NOT NULL,
    row_number integer NOT NULL,
    booking_id integer
);


--
-- TOC entry 234 (class 1259 OID 16521)
-- Name: booked_seats_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booked_seats_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 234
-- Name: booked_seats_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booked_seats_id_seq1 OWNED BY public.booked_seats.id;


--
-- TOC entry 231 (class 1259 OID 16473)
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    booking_id integer NOT NULL,
    user_id integer,
    showtime_id integer,
    seat_id integer,
    booking_code character varying(50) NOT NULL,
    total_amount numeric(10,2),
    status character varying(50) DEFAULT 'pending'::character varying,
    booking_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expiry_time timestamp without time zone,
    qr_code text,
    CONSTRAINT bookings_total_amount_check CHECK ((total_amount >= (0)::numeric))
);


--
-- TOC entry 230 (class 1259 OID 16472)
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 230
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 227 (class 1259 OID 16441)
-- Name: movies; Type: TABLE; Schema: public; Owner: -
--

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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT movies_duration_minutes_check CHECK ((duration_minutes > 0))
);


--
-- TOC entry 226 (class 1259 OID 16440)
-- Name: movies_movie_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movies_movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 226
-- Name: movies_movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movies_movie_id_seq OWNED BY public.movies.movie_id;


--
-- TOC entry 233 (class 1259 OID 16492)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    booking_id integer,
    amount numeric(10,2),
    payment_method character varying(50),
    transaction_id character varying(100),
    payment_status character varying(50),
    payment_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    gateway_response text,
    CONSTRAINT payments_amount_check CHECK ((amount >= (0)::numeric))
);


--
-- TOC entry 232 (class 1259 OID 16491)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 232
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 225 (class 1259 OID 16428)
-- Name: screens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screens (
    screen_id integer NOT NULL,
    theater_id integer,
    screen_name character varying(100) NOT NULL,
    total_seats integer NOT NULL,
    total_seats_per_row integer,
    screen_type character varying(50),
    CONSTRAINT screens_total_seats_check CHECK ((total_seats > 0))
);


--
-- TOC entry 224 (class 1259 OID 16427)
-- Name: screens_screen_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.screens_screen_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 224
-- Name: screens_screen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.screens_screen_id_seq OWNED BY public.screens.screen_id;


--
-- TOC entry 229 (class 1259 OID 16453)
-- Name: showtimes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.showtimes (
    showtime_id integer NOT NULL,
    movie_id integer,
    screen_id integer,
    show_date date NOT NULL,
    show_time time without time zone NOT NULL,
    base_price numeric(10,2),
    available_seats integer,
    is_active boolean DEFAULT true,
    CONSTRAINT showtimes_available_seats_check CHECK ((available_seats >= 0)),
    CONSTRAINT showtimes_base_price_check CHECK ((base_price >= (0)::numeric))
);


--
-- TOC entry 228 (class 1259 OID 16452)
-- Name: showtimes_showtime_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.showtimes_showtime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 228
-- Name: showtimes_showtime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.showtimes_showtime_id_seq OWNED BY public.showtimes.showtime_id;


--
-- TOC entry 223 (class 1259 OID 16418)
-- Name: theaters; Type: TABLE; Schema: public; Owner: -
--

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


--
-- TOC entry 222 (class 1259 OID 16417)
-- Name: theaters_theater_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.theaters_theater_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 222
-- Name: theaters_theater_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.theaters_theater_id_seq OWNED BY public.theaters.theater_id;


--
-- TOC entry 219 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    first_name character varying(200),
    last_name character varying(200)
);


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4821 (class 2604 OID 16405)
-- Name: admins admin_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN admin_id SET DEFAULT nextval('public.admins_admin_id_seq'::regclass);


--
-- TOC entry 4838 (class 2604 OID 16525)
-- Name: booked_seats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booked_seats ALTER COLUMN id SET DEFAULT nextval('public.booked_seats_id_seq1'::regclass);


--
-- TOC entry 4833 (class 2604 OID 16476)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 16444)
-- Name: movies movie_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies ALTER COLUMN movie_id SET DEFAULT nextval('public.movies_movie_id_seq'::regclass);


--
-- TOC entry 4836 (class 2604 OID 16495)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 16431)
-- Name: screens screen_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens ALTER COLUMN screen_id SET DEFAULT nextval('public.screens_screen_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 16456)
-- Name: showtimes showtime_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtimes ALTER COLUMN showtime_id SET DEFAULT nextval('public.showtimes_showtime_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 16421)
-- Name: theaters theater_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theaters ALTER COLUMN theater_id SET DEFAULT nextval('public.theaters_theater_id_seq'::regclass);


--
-- TOC entry 4819 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5027 (class 0 OID 16402)
-- Dependencies: 221
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (admin_id, username, email, password_hash, role, created_at, is_active) FROM stdin;
1	admin	admin@cinema.com	$2a$06$IRnCXMcnU0rKVV47FinuqOvaN4AhQlDuYjpeGQkeB91RNm1c6jFJe	SUPERADMIN	2025-12-02 20:56:21.374156	t
2	admin2	admin@admin.com	$2a$06$ILyv0Sl3hOY12wlc8wX9/.3i4N6YzaVj8ol0etSdLDpdN39reqesW	SUPERADMIN	2025-12-03 03:58:32.238169	t
\.


--
-- TOC entry 5041 (class 0 OID 16522)
-- Dependencies: 235
-- Data for Name: booked_seats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.booked_seats (id, screen_id, showtime_id, seat_number, row_number, booking_id) FROM stdin;
1	1	8	1	1	2
2	1	8	2	1	2
3	1	8	3	1	3
4	2	7	4	2	4
5	2	2	7	3	5
6	2	7	5	4	6
\.


--
-- TOC entry 5037 (class 0 OID 16473)
-- Dependencies: 231
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookings (booking_id, user_id, showtime_id, seat_id, booking_code, total_amount, status, booking_time, expiry_time, qr_code) FROM stdin;
2	1	8	\N	S1MD5E	20.64	PAID	2025-11-27 02:04:20.774778	\N	\N
3	1	8	\N	LQGGNI	12.90	PAID	2025-11-27 02:55:27.965874	\N	\N
4	1	7	\N	3ZYUHA	14.50	PAID	2025-11-27 22:05:57.001276	\N	\N
5	1	2	\N	MT6BZ4	14.00	PAID	2025-12-04 22:40:05.673273	\N	\N
6	1	7	\N	16M76U	14.50	PAID	2025-12-05 10:45:08.227155	\N	\N
\.


--
-- TOC entry 5033 (class 0 OID 16441)
-- Dependencies: 227
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.movies (movie_id, title, description, duration_minutes, language, genre, rating, poster_url, trailer_url, release_date, is_active, created_at) FROM stdin;
1	Inception	A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his criminal history.	148	English	Sci-Fi	PG-13	https://images.moviesanywhere.com/e7e6741dd8d06aa686a375d36b93ee65/5846c52b-6cdc-485c-b994-1c71027227c1.jpg?r=3x1&w=2400	https://www.youtube.com/watch?v=YoHD9XEInc0	2010-07-16	t	2025-11-13 02:43:30.206951
2	Spider-Man: Homecoming	Peter Parker balances life as an ordinary high school student with his superhero alter-ego Spider-Man, as he faces the villain Vulture.	133	English	Action	PG-13	https://upload.wikimedia.org/wikipedia/en/f/f9/Spider-Man_Homecoming_poster.jpg	https://www.youtube.com/watch?v=39udgGPyYMg	2017-07-07	t	2025-11-13 21:38:01.736006
4	Avengers: Secret Wars	Earth’s Mightiest Heroes face their greatest multiversal threat in the final chapter of the Multiverse Saga.	160	English	Action, Sci-Fi, Adventure	PG-13	https://image.tmdb.org/t/p/original/your_upcoming_movie_poster.jpg	https://www.youtube.com/watch?v=your_trailer_link	2026-05-02	t	2025-11-19 01:08:03.344463
5	Interstellar	\N	\N	\N	Adventure, Sci-Fi	7.6	https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg%20190w,%20https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX285_CR0,0,285,422_.jpg%20285w,%20https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg	\N	2025-12-03	t	2025-12-03 04:35:27.239767
6	Avenger Endgame	\N	155	\N	Action 	9	https://www.hdwallpapers.in/download/avengers_endgame_official_poster_4k-2560x1440.jpg	\N	2021-08-01	t	2025-12-04 22:37:25.207871
\.


--
-- TOC entry 5039 (class 0 OID 16492)
-- Dependencies: 233
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (payment_id, booking_id, amount, payment_method, transaction_id, payment_status, payment_time, gateway_response) FROM stdin;
1	2	20.64	CARD	PY-1764202119187	SUCCESS	2025-11-27 02:08:39.190062	\N
2	3	12.90	CARD	PY-1764205137320	SUCCESS	2025-11-27 02:58:57.321265	\N
3	4	14.50	CARD	PY-1764274009335	SUCCESS	2025-11-27 22:06:49.338226	\N
4	5	14.00	CARD	PY-1764880851470	SUCCESS	2025-12-04 22:40:51.472211	\N
5	6	14.50	CARD	PY-1764924339147	SUCCESS	2025-12-05 10:45:39.150944	\N
\.


--
-- TOC entry 5031 (class 0 OID 16428)
-- Dependencies: 225
-- Data for Name: screens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.screens (screen_id, theater_id, screen_name, total_seats, total_seats_per_row, screen_type) FROM stdin;
1	1	Screen 1	50	10	IMAX
2	2	Screen 2	50	10	4K Digital
3	1	Screen 1	50	10	IMAX
\.


--
-- TOC entry 5035 (class 0 OID 16453)
-- Dependencies: 229
-- Data for Name: showtimes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.showtimes (showtime_id, movie_id, screen_id, show_date, show_time, base_price, available_seats, is_active) FROM stdin;
1	1	1	2025-12-20	18:00:00	12.50	40	t
2	2	2	2025-12-20	20:30:00	14.00	40	t
3	1	1	2025-12-20	18:00:00	12.50	40	t
4	1	1	2025-12-20	18:00:00	12.90	\N	t
5	1	1	2025-12-20	21:00:00	12.90	\N	t
6	2	2	2025-12-20	17:00:00	14.50	\N	t
7	2	2	2025-12-20	20:00:00	14.50	\N	t
8	1	1	2025-12-20	21:00:00	12.90	\N	t
\.


--
-- TOC entry 5029 (class 0 OID 16418)
-- Dependencies: 223
-- Data for Name: theaters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.theaters (theater_id, name, address, city, state, postal_code, phone, facilities, is_active) FROM stdin;
1	North Star Cinema	123 Aurora Street	Oulu	Northern Ostrobothnia	90100	+358401234567	3D Projection, Dolby Atmos, Snack Bar	t
2	Oulu Central Theater	45 Rotuaari Street	Oulu	Northern Ostrobothnia	90100	+358409998877	4K Projection, Dolby Surround, Snack Bar, Recliner Seats	t
3	North Star Cinema	123 Aurora Street	Oulu	Northern Ostrobothnia	90100	+358401234567	3D Projection, Dolby Atmos, Snack Bar	t
\.


--
-- TOC entry 5025 (class 0 OID 16390)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, created_at, first_name, last_name) FROM stdin;
1	admin@admin.com	$2b$10$CCq0btPtcAt2FqXF3qBPd.JcvF0RwDLFTUUtdGe0xZXpWd9yrHFtW	2025-11-06 18:05:52.515285	\N	\N
\.


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 220
-- Name: admins_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_admin_id_seq', 2, true);


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 234
-- Name: booked_seats_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.booked_seats_id_seq1', 6, true);


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 230
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 6, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 226
-- Name: movies_movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.movies_movie_id_seq', 6, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 232
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 5, true);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 224
-- Name: screens_screen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.screens_screen_id_seq', 3, true);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 228
-- Name: showtimes_showtime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.showtimes_showtime_id_seq', 8, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 222
-- Name: theaters_theater_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.theaters_theater_id_seq', 4, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- TOC entry 4850 (class 2606 OID 16416)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 4852 (class 2606 OID 16412)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (admin_id);


--
-- TOC entry 4854 (class 2606 OID 16414)
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- TOC entry 4870 (class 2606 OID 16527)
-- Name: booked_seats booked_seats_pkey1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booked_seats
    ADD CONSTRAINT booked_seats_pkey1 PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 16485)
-- Name: bookings bookings_booking_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_code_key UNIQUE (booking_code);


--
-- TOC entry 4866 (class 2606 OID 16483)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4860 (class 2606 OID 16451)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movie_id);


--
-- TOC entry 4868 (class 2606 OID 16501)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4858 (class 2606 OID 16434)
-- Name: screens screens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens
    ADD CONSTRAINT screens_pkey PRIMARY KEY (screen_id);


--
-- TOC entry 4862 (class 2606 OID 16461)
-- Name: showtimes showtimes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_pkey PRIMARY KEY (showtime_id);


--
-- TOC entry 4856 (class 2606 OID 16426)
-- Name: theaters theaters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.theaters
    ADD CONSTRAINT theaters_pkey PRIMARY KEY (theater_id);


--
-- TOC entry 4846 (class 2606 OID 16400)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4848 (class 2606 OID 16398)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4876 (class 2606 OID 16538)
-- Name: booked_seats booked_seats_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booked_seats
    ADD CONSTRAINT booked_seats_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id);


--
-- TOC entry 4877 (class 2606 OID 16528)
-- Name: booked_seats booked_seats_screen_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booked_seats
    ADD CONSTRAINT booked_seats_screen_id_fkey1 FOREIGN KEY (screen_id) REFERENCES public.screens(screen_id) ON DELETE CASCADE;


--
-- TOC entry 4878 (class 2606 OID 16533)
-- Name: booked_seats booked_seats_showtime_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booked_seats
    ADD CONSTRAINT booked_seats_showtime_id_fkey FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id) ON DELETE CASCADE;


--
-- TOC entry 4874 (class 2606 OID 16486)
-- Name: bookings bookings_showtime_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_showtime_id_fkey FOREIGN KEY (showtime_id) REFERENCES public.showtimes(showtime_id) ON DELETE CASCADE;


--
-- TOC entry 4875 (class 2606 OID 16502)
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(booking_id) ON DELETE CASCADE;


--
-- TOC entry 4871 (class 2606 OID 16435)
-- Name: screens screens_theater_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screens
    ADD CONSTRAINT screens_theater_id_fkey FOREIGN KEY (theater_id) REFERENCES public.theaters(theater_id) ON DELETE CASCADE;


--
-- TOC entry 4872 (class 2606 OID 16462)
-- Name: showtimes showtimes_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(movie_id) ON DELETE CASCADE;


--
-- TOC entry 4873 (class 2606 OID 16467)
-- Name: showtimes showtimes_screen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.showtimes
    ADD CONSTRAINT showtimes_screen_id_fkey FOREIGN KEY (screen_id) REFERENCES public.screens(screen_id) ON DELETE CASCADE;


-- Completed on 2025-12-11 02:43:41

--
-- PostgreSQL database dump complete
--

