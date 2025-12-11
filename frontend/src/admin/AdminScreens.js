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

function AdminScreens() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const [screens, setScreens] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    const t = await axios.get(`${API}/admin/theaters`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    const sc = await axios.get(`${API}/admin/screens`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    setTheaters(t.data);
    setScreens(sc.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await axios.post(`${API}/admin/screens`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({});
    load();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
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

        <h2>Manage Screens</h2>

        {/* ---------------- ADD SCREEN ---------------- */}
        <div style={{ 
          background: "#222", 
          padding: "20px", 
          borderRadius: "8px", 
          maxWidth: "400px",
          marginBottom: "25px"
        }}>
          <h3>Add Screen</h3>

          {/* Theater Dropdown */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#0e7afe", marginBottom: "6px" }}>
              🎭 Select Theater
            </label>

            <select
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "2px solid #0e7afe",
                width: "100%",
                background: "#e8f2ff",
                color: "#003366",
              }}
              onChange={(e) => setForm({ ...form, theater_id: e.target.value })}
            >
              <option value="">Choose a Theater</option>
              {theaters.map((t) => (
                <option key={t.theater_id} value={t.theater_id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Screen Name */}
          <input
            placeholder="Screen Name"
            style={inputStyle}
            onChange={e => setForm({ ...form, screen_name: e.target.value })}
          />

          {/* Total Seats */}
          <input
            placeholder="Total Seats"
            style={inputStyle}
            onChange={e => setForm({ ...form, total_seats: e.target.value })}
          />

          {/* Seats Per Row */}
          <input
            placeholder="Seats Per Row"
            style={inputStyle}
            onChange={e => setForm({ ...form, total_seats_per_row: e.target.value })}
          />

          <button 
            onClick={save} 
            style={saveButton}
          >
            Save
          </button>
        </div>

        {/* ---------------- ALL SCREENS LIST ---------------- */}
        <h3>All Screens</h3>
        {screens.map(sc => (
          <div 
            key={sc.screen_id}
            style={{
              background: "#333",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "10px",
            }}
          >
            {sc.screen_name} — {sc.theater_name}
          </div>
        ))}

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const saveButton = {
  width: "100%",
  padding: "10px",
  background: "#0e7afe",
  border: "none",
  color: "white",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "5px"
};

export default AdminScreens;
