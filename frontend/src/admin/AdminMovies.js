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

function AdminMovies() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    const res = await axios.get(`${API}/admin/movies`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMovies(res.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await axios.post(`${API}/admin/movies`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({});
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    await axios.delete(`${API}/admin/movies/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    load();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh"}}>
      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "#111",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column"
      }}>
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

      {/* Main content */}
      <div style={{ flex: 1, padding: "40px", color: "white" }}>
        <div style={{ color: 'white' }}>
          <h2>Manage Movies</h2>

          {/* ---------------- ADD MOVIE FORM ---------------- */}
          <div
            style={{
              background: "#222",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              marginBottom: "25px",
            }}
          >
            <h3 style={{ color: "#0e7afe" }}>Add New Movie</h3>

            {/* Title */}
            <label style={labelStyle}>🎬 Title</label>
            <input
              style={inputStyle}
              placeholder="Movie Title"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            {/* Genre */}
            <label style={labelStyle}>🎭 Genre</label>
            <input
              style={inputStyle}
              placeholder="Genre"
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            />

            {/* Rating */}
            <label style={labelStyle}>⭐ Rating</label>
            <input
              style={inputStyle}
              placeholder="Rating (e.g., PG-13)"
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />

            {/* Duration */}
            <label style={labelStyle}>⏳ Duration (minutes)</label>
            <input
              style={inputStyle}
              placeholder="Duration"
              type="number"
              onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            />

            {/* Poster URL */}
            <label style={labelStyle}>🖼 Poster URL</label>
            <input
              style={inputStyle}
              placeholder="Poster Image URL"
              onChange={(e) => setForm({ ...form, poster_url: e.target.value })}
            />

            {/* Release Date */}
            <label style={labelStyle}>📅 Release Date</label>
            <input
              style={inputStyle}
              type="date"
              onChange={(e) => setForm({ ...form, release_date: e.target.value })}
            />

            <button style={saveButton} onClick={save}>
              Save Movie
            </button>
          </div>


          <hr />

          <h3>All Movies</h3>

          <div style={gridContainer}>
            {movies.map((m) => (
              <div key={m.movie_id} style={movieCard}>
                <img
                  src={m.poster_url || "https://via.placeholder.com/150"}
                  alt={m.title}
                  style={posterStyle}
                />

                <div style={{ padding: "10px 15px" }}>
                  <h4 style={movieTitle}>{m.title}</h4>
                  <p style={movieInfo}>
                    🎭 {m.genre || "N/A"}
                    <br />
                    ⭐ Rating: {m.rating || "N/A"}
                    <br />
                    ⏳ {m.duration_minutes ? m.duration_minutes + " min" : ""}
                  </p>

                  <button
                    style={deleteButton}
                    onClick={() => remove(m.movie_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>

  );
}

export default AdminMovies;

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "#f4f4f4",
  fontSize: "15px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
  color: "#0e7afe",
};

const saveButton = {
  width: "100%",
  padding: "10px",
  background: "#0e7afe",
  border: "none",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
  fontSize: "16px",
};

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "20px"
};

const movieCard = {
  background: "#1c1c1c",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

movieCard["&:hover"] = {
  transform: "scale(1.02)",
  boxShadow: "0 6px 15px rgba(0,0,0,0.4)",
};

const posterStyle = {
  width: "100%",
  height: "260px",
  objectFit: "cover"
};

const movieTitle = {
  margin: "0",
  color: "white",
  fontSize: "18px",
  marginBottom: "6px"
};

const movieInfo = {
  margin: "0",
  color: "#ccc",
  fontSize: "14px",
  lineHeight: "1.5",
  marginBottom: "14px"
};

const deleteButton = {
  width: "100%",
  padding: "8px",
  background: "crimson",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  borderRadius: "6px",
  transition: "0.2s"
};

deleteButton["&:hover"] = {
  background: "#b70000"
};
