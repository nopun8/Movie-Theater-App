import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import UpcomingMovies from './components/UpcomingMovies';


import MoviesList from './components/MoviesList';
import MovieDetails from './components/MovieDetails';
import ShowtimesList from './components/ShowtimesList';
import SeatSelection from './components/SeatSelection';

import BookingPage from './components/BookingPage';
import PaymentPage from './components/PaymentPage';

import AdminMovies from "./admin/AdminMovies";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminTheaters from "./admin/AdminTheaters";
import AdminScreens from "./admin/AdminScreens";
import AdminShowtimes from "./admin/AdminShowtimes";


const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
};
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#0e7afe',
  padding: '10px 20px',
  color: '#fff',
}

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      {!isAdmin && (
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              width={60}
              height={70}
              src="http://localhost:3000/assets/north-star-logo.jpg"
              alt="App Logo"
              style={{ borderRadius: 8, cursor: 'pointer' }}
            />
            <h2 style={{ margin: 0 }}>Movie Theater App</h2>
          </div>

          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/movies" style={linkStyle}>Movies</Link>
            <Link to="/upcoming" style={linkStyle}>Upcoming</Link>
          </nav>
        </header>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />


        <Route path="/movies" element={<MoviesList />} />
        <Route path="/movies/:movieId" element={<MovieDetails />} />


        <Route path="/movies/:movieId/showtimes" element={<ShowtimesList />} />

        <Route path="/upcoming" element={<UpcomingMovies />} />

        <Route path="/showtime/:showtimeId/seats" element={<SeatSelection />} />
        <Route path="/booking/:bookingId" element={<BookingPage />} />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/theaters" element={<AdminTheaters />} />
        <Route path="/admin/screens" element={<AdminScreens />} />
        <Route path="/admin/showtimes" element={<AdminShowtimes />} />
        <Route path="/admin/movies" element={<AdminMovies />} />

      </Routes>
    </div>
  );
}

export default App;
