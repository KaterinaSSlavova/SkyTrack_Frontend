import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyBooking } from "../api/bookingApi";
import "./BoardingPassPage.css";

function formatDate(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}

function formatTime(value) {
    if (!value) return "--:--";
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

export default function BoardingPassPage() {
    const { reference } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBooking() {
            try {
                const data = await verifyBooking(reference);
                setBooking(data);
            } catch {
                setError("This boarding pass could not be found.");
            } finally {
                setLoading(false);
            }
        }

        loadBooking();
    }, [reference]);

    if (loading) return <p className="boarding-loading">Loading boarding pass...</p>;
    if (error) return <p className="boarding-error">{error}</p>;

    return (
        <div className="boarding-page">
            <div className="boarding-pass">
                <div className="boarding-header">
                    <h2>SkyTrack Boarding Pass</h2>
                    <span className={`boarding-status ${booking.status?.toLowerCase()}`}>
                        {booking.status}
                    </span>
                </div>

                <div className="boarding-route">
                    <div>
                        <h1>{booking.flight?.departureIataCode}</h1>
                        <p>{booking.flight?.departureAirportName}</p>
                    </div>

                    <span className="boarding-plane">✈</span>

                    <div>
                        <h1>{booking.flight?.arrivalIataCode}</h1>
                        <p>{booking.flight?.arrivalAirportName}</p>
                    </div>
                </div>

                <div className="boarding-info-grid">
                    <div>
                        <span>Passenger</span>
                        <strong>{booking.passenger?.firstName} {booking.passenger?.lastName}</strong>
                    </div>

                    <div>
                        <span>Flight</span>
                        <strong>{booking.flight?.flightNumber}</strong>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>{formatDate(booking.flight?.departureLocalTime)}</strong>
                    </div>

                    <div>
                        <span>Departure</span>
                        <strong>{formatTime(booking.flight?.departureLocalTime)}</strong>
                    </div>

                    <div>
                        <span>Arrival</span>
                        <strong>{formatTime(booking.flight?.arrivalLocalTime)}</strong>
                    </div>

                    <div>
                        <span>Seat</span>
                        <strong>{booking.seat?.seatNumber ?? "—"}</strong>
                    </div>
                </div>

                <div className="boarding-footer">
                    <span>Booking reference</span>
                    <strong>{booking.bookingReference}</strong>
                </div>
            </div>
        </div>
    );
}