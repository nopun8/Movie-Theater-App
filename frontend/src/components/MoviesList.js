import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MoviesList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMovies(data);
        else if (data && Array.isArray(data.rows)) setMovies(data.rows);
        else setMovies([]);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="movie-list" style={{ padding: '20px' }}>
      <h2 style={{color : "white"}}> 🎬 Now Showing</h2>
      <div className="grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map(movie => (
          <div key={movie.movie_id} className="card" style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', width: '220px' }}>
            <img
              src={movie.poster_url || 'https://via.placeholder.com/200x300?text=No+Poster'}
              alt={movie.title}
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <h3>{movie.title}</h3>
            <p>{movie.genre} | {movie.rating}</p>
            <p>Duration: {movie.duration_minutes} mins</p>

            {movie.theater_name && (
              <p><strong>Theater:</strong> {movie.theater_name}</p>
            )}
            {movie.screen_name && (
              <p><strong>Screen:</strong> {movie.screen_name}</p>
            )}
            {movie.next_show_date && (
              <p><strong>Next show:</strong> {movie.next_show_date} at {movie.next_show_time}</p>
            )}

            <Link
              to={`/movies/${movie.movie_id}`}
              style={{
                display: 'inline-block',
                marginTop: '10px',
                backgroundColor: '#0e7afe',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '5px',
                textDecoration: 'none'
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
