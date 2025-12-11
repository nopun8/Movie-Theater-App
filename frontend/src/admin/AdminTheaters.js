import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import API from "../Api";

// Sidebar link style
const linkStyle = {
    padding: "10px 0",
    textDecoration: "none",
    color: "white",
    fontSize: "18px"
};

function AdminTheaters() {
    const navigate = useNavigate();
    const token = localStorage.getItem("adminToken");

    const [theaters, setTheaters] = useState([]);
    const [form, setForm] = useState({});

    // Logout admin
    const logout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    // Load theaters
    const load = async () => {
        const res = await axios.get(`${API}/admin/theaters`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTheaters(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    // Save new theater
    const save = async () => {
        await axios.post(`${API}/admin/theaters`, form, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setForm({});
        load();
    };

    // Delete theater
    const remove = async (id) => {
        if (!window.confirm("Delete this theater?")) return;
        await axios.delete(`${API}/admin/theaters/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        load();
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>

            {/* Sidebar */}
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

            {/* Main content */}
            <div style={{ flex: 1, padding: "40px", color: "white" }}>
                <h2>Manage Theaters</h2>

                {/* Add theater */}
                <div
                    style={{
                        background: "#222",
                        padding: "20px",
                        borderRadius: "8px",
                        maxWidth: "400px",
                        marginBottom: "25px"
                    }}
                >
                    <h3 style={{ color: "#0e7afe" }}>Add New Theater</h3>

                    {/* Theater Name */}
                    <label style={labelStyle}>🎭 Name</label>
                    <input
                        placeholder="Theater Name"
                        style={inputStyle}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    {/* City */}
                    <label style={labelStyle}>🌆 City</label>
                    <input
                        placeholder="City"
                        style={inputStyle}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />

                    {/* Address */}
                    <label style={labelStyle}>📍 Address</label>
                    <input
                        placeholder="Address"
                        style={inputStyle}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />

                    {/* Phone */}
                    <label style={labelStyle}>📞 Phone</label>
                    <input
                        placeholder="Phone"
                        style={inputStyle}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />

                    <button style={saveButton} onClick={save}>
                        Save Theater
                    </button>
                </div>


                <hr style={{ opacity: 0.3 }} />

                {/* Theaters list */}
                <h3 style={{ marginTop: "20px" }}>Existing Theaters</h3>

                <div style={{ marginTop: "15px" }}>
                    {theaters.map((th) => (
                        <div
                            key={th.theater_id}
                            style={itemCard}
                        >
                            <div>
                                <strong>{th.name}</strong>
                                <div style={{ fontSize: "14px", color: "#ccc" }}>
                                    {th.city}
                                </div>
                            </div>

                            <button style={deleteBtn} onClick={() => remove(th.theater_id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ---- Styles ---- */
const inputBox = {
    display: "block",
    width: "100%",
    maxWidth: "350px",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#f4f4f4",
    fontSize: "15px"
};

const saveBtn = {
    padding: "10px 20px",
    background: "#0e7afe",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "5px"
};

const itemCard = {
    background: "#333",
    padding: "14px",
    borderRadius: "6px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const deleteBtn = {
    padding: "6px 12px",
    border: "none",
    background: "crimson",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer"
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  background: "#f4f4f4",
  fontSize: "15px"
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
  color: "#0e7afe"
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
  fontSize: "16px"
};


export default AdminTheaters;
