import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "../Api";

const API_BASE = API

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/bookings/details/${bookingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load booking');
        setBooking(data);
      } catch (err) {
        console.error(err);
        setMessage('Could not load booking');
      }
    };
    load();
  }, [bookingId, navigate]);

  const handlePay = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          booking_id: bookingId,
          card_number: cardNumber,
          card_name: cardName,
          expiry,
          cvv,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment failed');
      }

      setMessage('Payment successful! Your booking is confirmed.');

    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Payment failed');
    }
  };

  if (!booking) {
    return <div style={{ padding: 20, color: 'white' }}>Loading booking for payment…</div>;
  }

  return (
    <div style={{ padding: 20, color: 'white' }}>
      <h2>Payment</h2>
      <p><strong>Booking:</strong> {booking.booking_code}</p>
      <p><strong>Movie:</strong> {booking.movie_title}</p>
      <p><strong>Total:</strong> €{booking.total_amount}</p>
      <p><strong>Payment Status:</strong> {booking.status}</p>
      {booking.status !== 'PAID' &&
        <div style={{ marginTop: 20, maxWidth: 300 }}>
            <input
            placeholder="Name on card"
            value={cardName}
            onChange={e => setCardName(e.target.value)}
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 4 }}
            />
            <input
            placeholder="Card number"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 4 }}
            />
            <input
            placeholder="MM/YY"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            style={{ width: '48%', marginRight: '4%', marginBottom: 8, padding: 8, borderRadius: 4 }}
            />
            <input
            placeholder="CVV"
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            style={{ width: '48%', marginBottom: 8, padding: 8, borderRadius: 4 }}
            />

            <button
            onClick={handlePay}
            style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 6,
                border: 'none',
                background: '#28a745',
                color: '#fff',
                cursor: 'pointer',
            }}
            >
            Pay Now
            </button>
        </div>
     } 

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}

export default PaymentPage;
