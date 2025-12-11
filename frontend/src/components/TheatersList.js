import React, { useEffect, useState } from 'react';
import API from "../Api";

function TheatersList() {
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/theaters`)
      .then(res => res.json())
      .then(data => setTheaters(data))
      .catch(err => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2>🎭 Theaters</h2>
      {theaters.map(th => (
        <div key={th.theater_id}>
          <h3>{th.name}</h3>
          <p>{th.city}, {th.state}</p>
        </div>
      ))}
    </div>
  );
}

export default TheatersList;
