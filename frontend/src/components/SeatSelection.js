import React, { useEffect, useState } from 'react';

function SeatSelection({ showtimeId }) {
  const [booked, setBooked] = useState([]);
  const seats = Array.from({ length: 40 }, (_, i) => i + 1); // Example: 40 seats

  useEffect(() => {
    fetch(`http://localhost:5000/api/seats/${showtimeId}`)
      .then(res => res.json())
      .then(data => setBooked(data.map(s => `${s.row_number}-${s.seat_number}`)))
      .catch(err => console.error(err));
  }, [showtimeId]);

  return (
    <div className="seat-grid">
      <h3>Select Your Seats</h3>
      <div className="grid">
        {seats.map(num => {
          const seatId = `1-${num}`;
          const isBooked = booked.includes(seatId);
          return (
            <div key={num}
              className={`seat ${isBooked ? 'booked' : 'available'}`}>
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SeatSelection;
