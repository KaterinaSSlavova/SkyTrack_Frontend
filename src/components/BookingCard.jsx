import { useState } from "react";
import { cancelBooking } from "../api/bookingApi";
import "./BookingCard.css";

function formatTime(value) {
    if (!value) return "--:--";
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function formatDate(value) {
    if (!value) return "--";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}

export default function BookingCard({ booking, qrCodes, highlight, onCancelled }) {
    const [expanded, setExpanded] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const statusClass = booking.status === "CANCELLED" ? "status-cancelled"
        : booking.status === "COMPLETED" ? "status-completed"
        : "status-active";

    const statusText = booking.status === "CANCELLED" ? "Cancelled"
        : booking.status === "COMPLETED" ? "Completed"
        : "Active";

    const handleCancel = async () => {
        setCancelling(true);
        try {
            await cancelBooking(booking.id);
            onCancelled();
        } catch {
            setCancelling(false);
            setConfirming(false);
        }
    };

    return (
        <div className={`booking-card ${highlight ? "booking-card-highlight" : ""}`}>
            {highlight && <div className="booking-card-badge">Next Trip ✈</div>}

            <div className="booking-card-top" onClick={() => setExpanded(!expanded)}>
                <div>
                    <p className="booking-card-route">
                        {booking.flight?.departureIataCode} → {booking.flight?.arrivalIataCode}
                    </p>
                    <p className="booking-card-detail">
                        {booking.flight?.flightNumber} · {formatDate(booking.flight?.departureLocalTime)} · {formatTime(booking.flight?.departureLocalTime)} – {formatTime(booking.flight?.arrivalLocalTime)}
                    </p>
                </div>
                <div className="booking-card-right">
                    <p className="booking-card-price">€{booking.totalPrice}</p>
                    <p className="booking-card-ref">Ref: {booking.bookingReference}</p>
                </div>
            </div>

            <div className="booking-card-details-row">
                <div className="booking-detail-box">
                    <span className="booking-detail-label">Passenger</span>
                    <p className="booking-detail-value">{booking.passenger?.firstName} {booking.passenger?.lastName}</p>
                </div>
                <div className="booking-detail-box">
                    <span className="booking-detail-label">Seat</span>
                    <p className="booking-detail-value">{booking.seat?.seatNumber ?? "—"}</p>
                </div>
                <div className="booking-detail-box">
                    <span className="booking-detail-label">Status</span>
                    <p className={`booking-detail-value ${statusClass}`}>{statusText}</p>
                </div>
            </div>

            {expanded && (
                <div className="booking-card-expanded-content">
                    <div className="booking-card-qr">
                        <span>Boarding Pass</span>
                        {qrCodes[booking.bookingReference] ? (
                            <img
                                src={qrCodes[booking.bookingReference]}
                                alt={`QR ${booking.bookingReference}`}
                            />
                        ) : (
                            <p className="booking-detail-value">—</p>
                        )}
                    </div>

                    {booking.status === "ACTIVE" && (
                        <div className="booking-cancel-section">
                            {!confirming ? (
                                <button className="btn-cancel" onClick={() => setConfirming(true)}>
                                    Cancel Booking
                                </button>
                            ) : (
                                <div className="booking-confirm-cancel">
                                    <p>Are you sure you want to cancel this booking?</p>
                                    <div className="booking-confirm-buttons">
                                        <button className="btn-confirm-cancel" onClick={handleCancel} disabled={cancelling}>
                                            {cancelling ? "Cancelling..." : "Yes, cancel"}
                                        </button>
                                        <button className="btn-keep" onClick={() => setConfirming(false)}>
                                            Keep Booking
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}