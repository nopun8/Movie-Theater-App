import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
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
        <h1>Welcome, Admin</h1>
        <p>Select a module from the left menu to manage your system.</p>
      </div>
    </div>
  );
}

const linkStyle = {
  padding: "10px 0",
  textDecoration: "none",
  color: "white",
  fontSize: "18px"
};

export default AdminDashboard;
