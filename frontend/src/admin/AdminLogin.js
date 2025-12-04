import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/admin/auth/login", {
        username,
        password
      });

      localStorage.setItem("adminToken", res.data.token);

      navigate("/admin/dashboard");

    } catch (err) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Username or Email"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default AdminLogin;
