import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./PaymentPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function formatTime(value) {
    if (!value) return "--:--";
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export default function PaymentPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { clientSecret, flight, passenger, seat, totalPrice } = state || {};

    if (!clientSecret) return <p>No payment data found.</p>;

    return (
        <div className="payment-page">
            <Sidebar />
            <div className="payment-content">
                <Topbar onProfileClick={() => navigate("/profile")} />

                <div className="payment-wrapper">

                    <div className="payment-summary">
                        <h3 className="summary-title">Booking Summary</h3>

                        <p className="summary-route">
                            {flight?.departureIataCode} → {flight?.arrivalIataCode}
                        </p>

                        <div className="summary-row">
                            <span>Flight</span>
                            <span>{flight?.flightNumber}</span>
                        </div>

                        <div className="summary-row">
                            <span>Departure</span>
                            <span>{formatTime(flight?.departureLocalTime)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Arrival</span>
                            <span>{formatTime(flight?.arrivalLocalTime)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Seat</span>
                            <span>
                                {seat?.seatNumber}
                                {seat?.window ? " · Window" : ""}
                                {seat?.aisle ? " · Aisle" : ""}
                                {seat?.extraLegroom ? " · Extra legroom" : ""}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Passenger</span>
                            <span>{passenger?.firstName} {passenger?.lastName}</span>
                        </div>

                        <div className="summary-row">
                            <span>Base Price</span>
                            <span>€{flight?.price}</span>
                        </div>

                        <hr className="summary-divider" />

                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>€{totalPrice}</span>
                        </div>
                    </div>

                    <div className="payment-card">
                        <div className="payment-header">
                            <h2 className="payment-title">Complete Payment ✈️</h2>
                            <p className="payment-subtitle">Enter your card details to confirm your booking</p>
                        </div>
                        <hr className="payment-divider" />
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <CheckoutForm />
                        </Elements>
                    </div>

                </div>
            </div>
        </div>
    );
}