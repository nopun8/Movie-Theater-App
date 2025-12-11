import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../Api";

const linkStyle = {
  padding: "10px 0",
  textDecoration: "none",
  color: "white",
  fontSize: "18px"
};

function AdminShowtimes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [form, setForm] = useState({});

  const load = async () => {
    const m = await axios.get(`${API}/admin/movies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const sc = await axios.get(`${API}/admin/screens`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const s = await axios.get(`${API}/admin/showtimes`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMovies(m.data);
    setScreens(sc.data);
    setShowtimes(s.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await axios.post(`${API}/admin/showtimes`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({});
    load();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* ---------- Sidebar ----------- */}
      <div
        style={{
          width: "240px",
          background: "#111",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>

        <Link to="/admin/movies" style={linkStyle}>🎬 Movies</Link>
        <Link to="/admin/theaters" style={linkStyle}>🏛 Theaters</Link>
        <Link to="/admin/screens" style={linkStyle}>📺 Screens</Link>
        <Link to="/admin/showtimes" style={linkStyle}>⏰ Showtimes</Link>

        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "10px",
            background: "crimson",
            border: "none",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* ----------- Main Content ---------- */}
      <div style={{ flex: 1, padding: "40px", color: "white" }}>

        <h2>Manage Showtimes</h2>

        {/* ---------- ADD SHOWTIME FORM ----------- */}
        <div
          style={{
            background: "#222",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "450px",
            marginBottom: "25px"
          }}
        >
          <h3 style={{ color: "#0e7afe" }}>Add Showtime</h3>

          {/* Movie */}
          <label style={{ display: "block", marginTop: 10 }}>🎬 Select Movie</label>
          <select
            style={dropdown}
            onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
          >
            <option value="">Choose Movie</option>
            {movies.map((m) => (
              <option key={m.movie_id} value={m.movie_id}>
                {m.title}
              </option>
            ))}
          </select>

          {/* Screen */}
          <label style={{ display: "block", marginTop: 10 }}>📺 Select Screen</label>
          <select
            style={dropdown}
            onChange={(e) => setForm({ ...form, screen_id: e.target.value })}
          >
            <option value="">Choose Screen</option>
            {screens.map((sc) => (
              <option key={sc.screen_id} value={sc.screen_id}>
                {sc.screen_name} ({sc.theater_name})
              </option>
            ))}
          </select>

          {/* Date */}
          <label style={{ display: "block", marginTop: 10 }}>📅 Date</label>
          <input
            type="date"
            style={inputStyle}
            onChange={(e) => setForm({ ...form, show_date: e.target.value })}
          />

          {/* Time */}
          <label style={{ display: "block", marginTop: 10 }}>⏰ Time</label>
          <input
            type="time"
            style={inputStyle}
            onChange={(e) => setForm({ ...form, show_time: e.target.value })}
          />

          {/* Price */}
          <label style={{ display: "block", marginTop: 10 }}>💶 Base Price (€)</label>
          <input
            placeholder="Base Price"
            style={inputStyle}
            onChange={(e) => setForm({ ...form, base_price: e.target.value })}
          />

          <button style={saveBtn} onClick={save}>
            Save Showtime
          </button>
        </div>

        {/* -------- List of showtimes -------- */}
        <h3>All Showtimes</h3>

        {showtimes.map((st) => (
          <div
            key={st.showtime_id}
            style={{
              background: "#333",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "10px"
            }}
          >
            <strong>{st.movie_title}</strong>
            <p>
              {st.show_date} — {st.show_time}
            </p>
            <p>
              🎭 {st.screen_name} ({st.theater_name})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */

const dropdown = {
  padding: "10px",
  width: "100%",
  borderRadius: "6px",
  border: "2px solid #0e7afe",
  marginBottom: "12px",
  background: "#e8f2ff"
};

const inputStyle = {
  padding: "10px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginBottom: "12px"
};

const saveBtn = {
  padding: "10px",
  width: "100%",
  background: "#0e7afe",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px"
};

export default AdminShowtimes;
