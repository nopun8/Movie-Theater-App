import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/login', {
        userEmail: email,
        password: password
      });
      console.log(response.data)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setMessage('Login successful!');
        // Navigate to dashboard
        navigate('/dashboard');
      }
      else{
        setMessage('Login unsuccessful');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Login</button>
      </form>
      
      <p className="toggle">
        Don't have an account?{' '}
        <Link to="/register">Register</Link>
      </p>
      
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Login;