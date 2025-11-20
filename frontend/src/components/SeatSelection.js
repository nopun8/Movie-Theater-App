// components/SeatSelection.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

function SeatSelection() {
  const { showtimeId } = useParams();

  const [totalSeats, setTotalSeats] = useState(0);
  const [seatsPerRow, setSeatsPerRow] = useState(0);
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [ageModalSeat, setAgeModalSeat] = useState(null);
  const [seatAges, setSeatAges] = useState({});

  // Load seats
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/seats/${showtimeId}`);
        const data = await res.json();

        setTotalSeats(data.total_seats);
        setSeatsPerRow(data.total_seats_per_row || 8);

        const bookedSet = new Set(
          (data.booked || []).map(s => `${s.row_number}-${s.seat_number}`)
        );

        setBookedSeats(bookedSet);
        setSelectedSeats(new Set());
      } catch (err) {
        console.error(err);
        setMessage("Could not load seat information.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showtimeId]);

  const rowsCount = seatsPerRow > 0 ? Math.ceil(totalSeats / seatsPerRow) : 0;

  // click on seat
  const toggleSeat = (row, number) => {
    const key = `${row}-${number}`;

    if (bookedSeats.has(key)) return;

    if (selectedSeats.has(key)) {
      const updated = new Set(selectedSeats);
      updated.delete(key);

      const agesCopy = { ...seatAges };
      delete agesCopy[key];

      setSelectedSeats(updated);
      setSeatAges(agesCopy);
      return;
    }

    // open modal
    setAgeModalSeat(key);
  };

  // Book seats
  const handleBook = async () => {
    if (selectedSeats.size === 0) {
      setMessage("Please select at least one seat.");
      return;
    }

    try {
      const seatsArray = Array.from(selectedSeats).map(k => {
        const [row_number, seat_number] = k.split('-').map(Number);
        return {
          row_number,
          seat_number,
          age: seatAges[k] || 20
        };
      });

      const res = await fetch(`${API_BASE}/seats/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showtimeId, seats: seatsArray })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Booking failed");
      }

      const newBooked = new Set(bookedSeats);
      selectedSeats.forEach(s => newBooked.add(s));

      setBookedSeats(newBooked);
      setSelectedSeats(new Set());
      setMessage("Seats booked successfully!");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Booking failed.");
    }
  };

  if (loading) {
    return <div style={{ padding: 20, color: "white" }}>Loading seats…</div>;
  }

  if (!totalSeats || !seatsPerRow) {
    return <div style={{ padding: 20, color: "white" }}>No seat information for this showtime.</div>;
  }

  return (
    <div style={{ padding: 20, color: "white" }}>

      {/* AGE MODAL — MUST BE INSIDE RETURN */}
      {ageModalSeat && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "#222",
              padding: 20,
              borderRadius: 10,
              width: 260,
              textAlign: "center",
              color: "white"
            }}
          >
            <h3>Select Ticket Type</h3>

            <button
              onClick={() => {
                setSeatAges(p => ({ ...p, [ageModalSeat]: 10 }));
                setSelectedSeats(p => new Set(p).add(ageModalSeat));
                setAgeModalSeat(null);
              }}
              style={{
                width: "100%",
                padding: 10,
                margin: "10px 0",
                background: "#0e7afe",
                borderRadius: 6,
                border: "none",
                color: "white"
              }}
            >
              Child (≤ 12)
            </button>

            <button
              onClick={() => {
                setSeatAges(p => ({ ...p, [ageModalSeat]: 20 }));
                setSelectedSeats(p => new Set(p).add(ageModalSeat));
                setAgeModalSeat(null);
              }}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 10,
                background: "#28a745",
                borderRadius: 6,
                border: "none",
                color: "white"
              }}
            >
              Adult (&gt; 12)
            </button>

            <button
              onClick={() => setAgeModalSeat(null)}
              style={{
                width: "100%",
                padding: 8,
                background: "crimson",
                borderRadius: 6,
                border: "none",
                color: "white"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <h2>🎟 Seat Selection</h2>
      <p>Showtime ID: <strong>{showtimeId}</strong></p>

      {/* Legend */}
      <div style={{ marginBottom: 10 }}>
        <span style={{ width: 16, height: 16, background: "#444", display: "inline-block", marginRight: 6 }} />
        Available
        <span style={{ width: 16, height: 16, background: "#0e7afe", display: "inline-block", marginLeft: 16, marginRight: 6 }} />
        Selected
        <span style={{ width: 16, height: 16, background: "crimson", display: "inline-block", marginLeft: 16, marginRight: 6 }} />
        Booked
      </div>

      {/* Seat Grid */}
      <div style={{ padding: 16, background: "#111", borderRadius: 8, display: "inline-block" }}>
        {Array.from({ length: rowsCount }, (_, rIndex) => {
          const row = rIndex + 1;
          return (
            <div key={row} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <div style={{ width: 24, textAlign: "right", marginRight: 8 }}>
                {String.fromCharCode(64 + row)}
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: seatsPerRow }, (_, sIndex) => {
                  const seatNumber = sIndex + 1;
                  const globalIndex = (row - 1) * seatsPerRow + seatNumber;
                  if (globalIndex > totalSeats) return null;

                  const key = `${row}-${seatNumber}`;
                  const isBooked = bookedSeats.has(key);
                  const isSelected = selectedSeats.has(key);

                  let bg = "#444";
                  if (isBooked) bg = "crimson";
                  else if (isSelected) bg = "#0e7afe";

                  return (
                    <div
                      key={seatNumber}
                      onClick={() => toggleSeat(row, seatNumber)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: bg,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: isBooked ? "not-allowed" : "pointer",
                        fontSize: 12
                      }}
                    >
                      {seatNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div>
      <button
        onClick={handleBook}
        style={{
          marginTop: 20,
          padding: "10px 14px",
          borderRadius: 6,
          background: "#0e7afe",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Confirm Booking
      </button>
      </div>
      {message && <p style={{ marginTop: 10, color: "lightgreen" }}>{message}</p>}
    </div>
  );
}

export default SeatSelection;
