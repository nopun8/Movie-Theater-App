// components/ShowtimesList.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function ShowtimesList() {
  const { movieId } = useParams(); // used when path is /movies/:movieId/showtimes
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        let url = `${API_BASE}/showtimes`;
        if (movieId) {
          url = `${API_BASE}/movies/${movieId}/showtimes`;
        }
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)
        setShowtimes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error:', err);
        setShowtimes([]);
      }
    };
    load();
  }, [movieId]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: 'white' }}>🕓 Showtimes</h2>
      {showtimes.map((st) => (
        <div style={{ color: 'white', marginBottom: 12 }} key={st.showtime_id}>
          <strong>{st.movie_title}</strong> — {st.theater_name}{' '}
          {st.screen_name && `(${st.screen_name})`}
          <br />
          {st.show_date} | {st.show_time} | €{st.base_price}
          <br />
          {st.is_upcoming ? (
            <span 
              style={{
                display: "inline-block",
                marginTop: 4,
                marginRight: 6,
                padding: "3px 8px",
                fontSize: 12,
                background: "green",
                color: "white",
                borderRadius: 6
              }}
            >
              UPCOMING
            </span>
          ) : (
            <span 
              style={{
                display: "inline-block",
                marginTop: 4,
                marginRight: 6,
                padding: "3px 8px",
                fontSize: 12,
                background: "crimson",
                color: "white",
                borderRadius: 6
              }}
            >
              EXPIRED
            </span>
          )}
          {st.is_upcoming && (
            <Link
              to={`/showtime/${st.showtime_id}/seats`}
              style={{
                display: 'inline-block',
                marginTop: 6,
                padding: '6px 10px',
                borderRadius: 6,
                background: '#0e7afe',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Select Seats →
            </Link>
          )}
          <hr />
        </div>
      ))}
      {!showtimes.length && (
        <p style={{ color: 'white' }}>No showtimes found.</p>
      )}
    </div>
  );
}

export default ShowtimesList;
