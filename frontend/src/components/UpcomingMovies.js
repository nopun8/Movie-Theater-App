import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function UpcomingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/movies/upcoming/list`);
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching upcoming movies:', err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ color: 'white' }}>📅 Upcoming Movies</h2>
      {loading && <p style={{ color: 'white' }}>Loading…</p>}

      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 10 }}
      >
        {movies.map((m) => (
          <div
            key={m.movie_id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 10,
              padding: 10,
              width: 220,
              background: '#111',
              color: 'white',
            }}
          >
            <img
              src={
                m.poster_url ||
                'https://via.placeholder.com/200x300?text=No+Poster'
              }
              alt={m.title}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: 6,
              }}
            />
            <h3>{m.title}</h3>
            <p>
              Release: <strong>{m.release_date}</strong>
            </p>
            <p>
              {m.genre} | {m.rating}
            </p>

            <Link
              to={`/movies/${m.movie_id}`}
              style={{
                display: 'inline-block',
                marginTop: 10,
                background: '#0e7afe',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 5,
                textDecoration: 'none',
              }}
            >
              View Details →
            </Link>
          </div>
        ))}

        {!loading && movies.length === 0 && (
          <p style={{ color: 'white' }}>No upcoming movies.</p>
        )}
      </div>
    </div>
  );
}

export default UpcomingMovies;
