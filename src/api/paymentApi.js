import api from "./apiClient";

export async function createPaymentIntent(bookingData, currency = "eur") {
    const response = await api.post("/payment/create-payment-intent", {
        currency,
        bookingRequest: bookingData,
    });

    return response.data;
}

export async function confirmPayment(paymentIntentId) {
    const response = await api.post("/payment/confirm", null, {
        params: {
            paymentIntentId,
        },
    });

    return response.data;
}