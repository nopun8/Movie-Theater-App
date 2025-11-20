// components/MoviesList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');

  const fetchMovies = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/movies`;

      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (genre) params.append('genre', genre);
      if (rating) params.append('rating', rating);

      if ([...params].length > 0) {
        url = `${API_BASE}/movies/search?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setMovies(data);
      else if (data && Array.isArray(data.rows)) setMovies(data.rows);
      else setMovies([]);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="movie-list" style={{ padding: '20px' }}>
      <h2 style={{ color: 'white' }}> 🎬 Now Showing</h2>

      {/* Search + Filter */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Genre (e.g. Action)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Rating (e.g. PG-13)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 14px',
            borderRadius: 4,
            border: 'none',
            background: '#0e7afe',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {loading && <p style={{ color: 'white' }}>Loading…</p>}

      <div
        className="grid"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}
      >
        {movies.map((movie) => (
          <div
            key={movie.movie_id}
            className="card"
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '10px',
              width: '220px',
            }}
          >
            <img
              src={
                movie.poster_url ||
                'https://via.placeholder.com/200x300?text=No+Poster'
              }
              alt={movie.title}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '6px',
              }}
            />
            <h3>{movie.title}</h3>
            <p>
              {movie.genre} | {movie.rating}
            </p>
            <p>Duration: {movie.duration_minutes} mins</p>

            <Link
              to={`/movies/${movie.movie_id}`}
              style={{
                display: 'inline-block',
                marginTop: '10px',
                backgroundColor: '#0e7afe',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '5px',
                textDecoration: 'none',
              }}
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoviesList;
