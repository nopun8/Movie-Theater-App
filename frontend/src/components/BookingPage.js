import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from "../Api";
const API_BASE = API;

function BookingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bookings/details/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load booking');
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId, navigate]);

  if (loading) return <div style={{ padding: 20, color: 'white' }}>Loading booking…</div>;
  if (!booking) return <div style={{ padding: 20, color: 'white' }}>Booking not found.</div>;

  return (
    <div style={{ padding: 20, color: 'white' }}>
      <h2>Booking Summary</h2>
      <p><strong>Booking Code:</strong> {booking.booking_code}</p>
      <p><strong>Movie:</strong> {booking.movie_title}</p>
      <p><strong>Theater:</strong> {booking.theater_name} ({booking.screen_name})</p>
      <p><strong>Showtime:</strong> {booking.show_date} {booking.show_time}</p>
      <p><strong>Name:</strong> {booking.first_name} {booking.last_name}</p>
      <p><strong>Email:</strong> {booking.email}</p>

      <p><strong>Seats:</strong> {
        (booking.seats || [])
          .map(s => `${String.fromCharCode(64 + s.row_number)}${s.seat_number}`)
          .join(', ')
      }</p>

      <p><strong>Total amount:</strong> €{booking.total_amount}</p>
      <p><strong>Status:</strong> {booking.status}</p>

      <button
        onClick={() => navigate(`/payment/${booking.booking_id}`)}
        style={{
          marginTop: 20,
          padding: '10px 16px',
          borderRadius: 6,
          border: 'none',
          background: '#0e7afe',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Proceed to Payment →
      </button>

      <p style={{ marginTop: 10 }}>
        <Link to="/" style={{ color: '#ccc' }}>← Back to Home</Link>
      </p>
    </div>
  );
}

export default BookingPage;
