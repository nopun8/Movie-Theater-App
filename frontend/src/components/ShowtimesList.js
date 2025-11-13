import React, { useEffect, useState } from 'react';

function ShowtimesList() {
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/showtimes')
      .then(res => res.json())
      .then(data => setShowtimes(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2 style={{color:"white"}}>🕓 Showtimes</h2>
      {showtimes.map(st => (
        <div style={{color:"white"}} key={st.showtime_id}>
          <strong>{st.movie_title}</strong> — {st.theater_name} ({st.screen_name})
          <br />
          {st.show_date} | {st.show_time} | €{st.base_price}
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ShowtimesList;
