
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`${API_BASE}/movies/${movieId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load movie');
        return r.json();
      })
      .then(data => {
        if (isMounted) {
          setMovie(data);
          setErr('');
        }
      })
      .catch(e => isMounted && setErr(e.message))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [movieId]);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (err) return <div style={{ padding: 16, color: 'crimson' }}>Error: {err}</div>;
  if (!movie) return <div style={{ padding: 16 }}>Movie not found.</div>;

  return (
    <div style={{ color : 'white', maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: 12 }}>{movie.title}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        <div>
          <img
            src={movie.poster_url || 'https://via.placeholder.com/200x300?text=No+Poster'}
            alt={movie.title}
            style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 8 }}
          />
        </div>

        <div>
          <p><strong>Genre:</strong> {movie.genre || '—'}</p>
          <p><strong>Language:</strong> {movie.language || '—'}</p>
          <p><strong>Rating:</strong> {movie.rating || '—'}</p>
          <p><strong>Duration:</strong> {movie.duration_minutes ? `${movie.duration_minutes} min` : '—'}</p>
          <p><strong>Release date:</strong> {movie.release_date || '—'}</p>
          <p style={{ marginTop: 12 }}>{movie.description || 'No description available.'}</p>

          {movie.trailer_url && (
            <p style={{ marginTop: 12 }}>
              <a href={movie.trailer_url} target="_blank" rel="noreferrer">
                ▶ Watch Trailer
              </a>
            </p>
          )}

          <div style={{ marginTop: 20 }}>
            <Link
              to={`/movies/${movieId}/showtimes`}
              style={{
                padding: '10px 14px',
                background: '#0e7afe',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              View Showtimes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
