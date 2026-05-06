import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSeatMap } from "../api/seatApi";
import { createBooking } from "../api/bookingApi";
import Sidebar from '../components/Sidebar';
import "./SeatSelectionPage.css";

export default function SeatSelectionPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { flight, passenger, dbFlightId } = state || {};

    const [seats, setSeats] = useState([]);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!dbFlightId) return;
        getSeatMap(dbFlightId)
            .then(data => setSeats(data.seats))
            .catch(() => setError("Failed to load seat map."))
            .finally(() => setLoading(false));
    }, [dbFlightId]);

    const handleConfirm = async () => {
        if (!selectedSeat) return;
        setSubmitting(true);
        setError("");
        try {
            const _booking = await createBooking({
                passenger,
                flight,
                seatId: selectedSeat.id,
            });
            navigate("/bookings");
        } catch {
            setError("Failed to create booking. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!flight || !passenger) return <p>Missing booking data.</p>;

    const rows = seats.reduce((acc, seat) => {
        const row = seat.seatNumber.slice(0, -1);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {});

    return (
        <div className="seat-page">
            <Sidebar />
            <div className="seat-content">
                <h2 className="seat-title">Select Your Seat</h2>

                <div className="seat-flight-summary">
                    <p className="seat-summary-route">{flight.departureIataCode} → {flight.arrivalIataCode}</p>
                    <p className="seat-summary-detail">{flight.flightNumber} · €{flight.price}</p>
                </div>

                {loading && <p className="seat-loading">Loading seat map...</p>}
                {error && <p className="seat-error">{error}</p>}

                {!loading && (
                    <>
                        <div className="seat-legend">
                            <span className="legend-item"><span className="legend-box available" />Available</span>
                            <span className="legend-item"><span className="legend-box unavailable" />Taken</span>
                            <span className="legend-item"><span className="legend-box selected" />Selected</span>
                        </div>

                        <div className="seat-map">
                            {Object.entries(rows).map(([row, rowSeats]) => (
                                <div key={row} className="seat-row">
                                    <span className="seat-row-label">{row}</span>
                                    <div className="seat-row-seats">
                                        {rowSeats.map(seat => (
                                            <button
                                                key={seat.id}
                                                className={`seat-btn
                                                    ${!seat.available ? "seat-unavailable" : ""}
                                                    ${selectedSeat?.id === seat.id ? "seat-selected" : ""}
                                                    ${seat.available && selectedSeat?.id !== seat.id ? "seat-available" : ""}
                                                `}
                                                disabled={!seat.available}
                                                onClick={() => setSelectedSeat(seat)}
                                                title={`${seat.seatNumber}${seat.window ? " · Window" : ""}${seat.aisle ? " · Aisle" : ""}${seat.extraLegroom ? " · Extra legroom" : ""}`}
                                            >
                                                {seat.seatNumber}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedSeat && (
                            <div className="seat-selected-info">
                                <p>Selected: <strong>{selectedSeat.seatNumber}</strong>
                                    {selectedSeat.window && " · Window"}
                                    {selectedSeat.aisle && " · Aisle"}
                                    {selectedSeat.extraLegroom && " · Extra legroom"}
                                </p>
                            </div>
                        )}

                        <button
                            className="seat-confirm-btn"
                            disabled={!selectedSeat || submitting}
                            onClick={handleConfirm}
                        >
                            {submitting ? "Booking..." : "Confirm Booking"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}