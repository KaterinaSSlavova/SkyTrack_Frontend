import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { confirmPayment } from '../api/paymentApi';
import "./CheckoutForm.css";

export default function CheckoutForm() {
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