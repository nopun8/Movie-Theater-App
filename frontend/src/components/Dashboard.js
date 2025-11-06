import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleProtected = async () => {
    try {
      const response = await axios.get('http://localhost:5000/protected-resource', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(response.data.data);
    } catch (error) {
      setMessage('Access denied. Token may be expired.');
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleGetUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Failed to fetch users');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>You are logged in!</p>
      
      <div className="button-group">
        <button onClick={handleProtected}>Get Protected Data</button>
        <button onClick={handleGetUsers}>Get All Users</button>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      {message && <p className="message">{message}</p>}
      
      {users.length > 0 && (
        <div className="users-list">
          <h3>Registered Users:</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;