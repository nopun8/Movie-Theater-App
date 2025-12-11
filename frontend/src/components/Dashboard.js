import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from "../Api";

function Dashboard() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Automatically load user bookings when dashboard loads
  useEffect(() => {
    if (token) loadMyBookings();
  }, [token]);

  // Fetch bookings of logged-in user
  const loadMyBookings = async () => {
    try {
      const response = await axios.get(`${API}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  // Fetch protected test data
  const handleProtected = async () => {
    try {
      const response = await axios.get(`${API}/protected-resource`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.data);
    } catch (error) {
      setMessage('Access denied. Token may be expired.');
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Fetch all users
  const handleGetUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch users');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Check if showtime is upcoming
  const isUpcoming = (date, time) => {
    const dt = new Date(`${formatDate(date)}T${time}`);
    return dt > new Date();
  };

  const upcoming = bookings.filter((b) =>
    isUpcoming(b.show_date, b.show_time)
  );
  const expired = bookings.filter((b) =>
    !isUpcoming(b.show_date, b.show_time)
  );

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>You are logged in!</p>

      {/* Buttons you already had */}
      <div className="button-group">
        <button onClick={handleProtected}>Get Protected Data</button>
        <button onClick={handleGetUsers}>Get All Users</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {message && <p className="message">{message}</p>}

      {/* Users list */}
      {users.length > 0 && (
        <div className="users-list">
          <h3>Registered Users:</h3>
          <ul>
            {users.map((u, index) => (
              <li key={index}>{u.email}</li>
            ))}
          </ul>
        </div>
      )}

      {/* My Bookings */}
      <div style={{ marginTop: 30 }}>
        <h3>My Bookings</h3>

        {/* UPCOMING */}
        <h4 style={{ color: "lime", marginTop: 10 }}>Upcoming</h4>
        {upcoming.length === 0 && <p>No upcoming bookings.</p>}
        <div  style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          marginTop: "10px"
        }}>
        {upcoming.map((b, index) => (
          <div key={index} style={{
            flex: "1 1 calc(33.333% - 16px)",
            maxWidth: "calc(33.333% - 16px)", 
            minWidth: "250px", 
            background: "#f8f6f6ff",
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
            borderLeft: "4px solid lime"
          }}>
            <strong>{b.movie_title}</strong>
            <p>{b.theater_name} ({b.screen_name})</p>
            <p>{formatDate(b.show_date)} | {b.show_time.slice(0,5)}</p>
            <p>
              Seats: {b.seats
                .map(s =>
                  `${String.fromCharCode(64 + s.row_number)}${s.seat_number}`
                )
                .join(", ")}
            </p>
            <p>Total: €{b.total_amount}</p>
            <p>Status: {b.status}</p>

            {/* Payment button only if pending */}
            {b.status === "PENDING" && (
              <button
                onClick={() => navigate(`/payment/${b.booking_id}`)}
                style={{
                  marginTop: 5,
                  padding: "6px 10px",
                  background: "#0e7afe",
                  border: "none",
                  color: "white",
                  borderRadius: 4
                }}
              >
                Complete Payment →
              </button>
            )}
          </div>
        ))}
        </div>

        {/* EXPIRED */}
        <h4 style={{ color: "#130303cc", marginTop: 20 }}>Expired</h4>
        {expired.length === 0 && <p>No expired bookings.</p>}

        {expired.map((b, index) => (
          <div key={index} style={{
            background: "#f8f6f6ff",
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
            borderLeft: "4px solid #130303cc"
          }}>
            <strong>{b.movie_title}</strong>
            <p>{b.theater_name} ({b.screen_name})</p>
            <p>{formatDate(b.show_date)} | {b.show_time.slice(0,5)}</p>
            <p>
              Seats: {b.seats
                .map(s =>
                  `${String.fromCharCode(64 + s.row_number)}${s.seat_number}`
                )
                .join(", ")}
            </p>
            <p>Total: €{b.total_amount}</p>
            <p>Status: {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
