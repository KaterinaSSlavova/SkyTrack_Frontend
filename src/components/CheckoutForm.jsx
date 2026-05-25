import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPayment } from '../api/paymentApi';
import "./CheckoutForm.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await confirmPayment(paymentIntent.id);
        navigate('/bookings');
      } catch {
        setMessage('Payment succeeded but booking failed. Please contact support.');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className="checkout-pay-btn" type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {message && <p className="checkout-error">{message}</p>}
    </form>
  );
}

export default function CheckoutPage() {
  const { state } = useLocation();
  const clientSecret = state?.clientSecret;

  if (!clientSecret) return <p>No payment data found.</p>;

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-header">
          <h2 className="checkout-title">Complete Payment ✈️</h2>
          <p className="checkout-subtitle">Enter your card details to confirm your booking</p>
        </div>
        <hr className="checkout-divider" />
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  );
}