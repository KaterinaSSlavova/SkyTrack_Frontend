import api from "./apiClient";

export async function createPaymentIntent(amount, currency = 'eur') {
  const response = await api.post('/payment/create-payment-intent', { amount,currency });
  return response.data;
}