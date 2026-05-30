import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSeatMap } from "../api/seatApi";
import { createPaymentIntent } from "../api/paymentApi";
import Sidebar from '../components/Sidebar';
import Topbar from "../components/Topbar";
import "./SeatSelectionPage.css";

const LEFT_SEATS  = ["A", "B", "C"];
const RIGHT_SEATS = ["D", "E", "F"];

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
            const { clientSecret, totalPrice } = await createPaymentIntent(
                { passenger, flight, seatId: selectedSeat.id }
            );
            navigate("/payment", {
                state: { clientSecret, flight, passenger, seat: selectedSeat, totalPrice }
            });
        } catch {
            setError("Failed to initiate payment. Please try again.");
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

    const getSeatClass = (seat) => {
        if (!seat.available)                                          return "seat-btn seat-unavailable";
        if (selectedSeat?.id === seat.id)                            return "seat-btn seat-selected";
        if (seat.extraLegroom)                                       return "seat-btn seat-extra-legroom";
        if (seat.window)                                             return "seat-btn seat-window";
        return "seat-btn seat-available";
    };

    const renderSeat = (seat) => (
        <button
            key={seat.id}
            className={getSeatClass(seat)}
            disabled={!seat.available}
            onClick={() => setSelectedSeat(seat)}
            title={`${seat.seatNumber}${seat.window ? " · Window +€10" : ""}${seat.aisle ? " · Aisle" : ""}${seat.extraLegroom ? " · Extra legroom +€25" : ""}`}
        >
            {seat.seatNumber}
        </button>
    );

    return (
        <div className="seat-page">
            <Sidebar />
            <div className="seat-content">
                <Topbar onProfileClick={() => navigate("/profile")} />

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
                            <span className="legend-item"><span className="legend-box extra-legroom" />Extra Legroom +€25</span>
                            <span className="legend-item"><span className="legend-box window" />Window +€10</span>
                        </div>

                        <div className="seat-map">
                            <div className="seat-map-header">
                                <span className="seat-map-header-label">A B C</span>
                                <span className="seat-map-header-aisle"></span>
                                <span className="seat-map-header-label">D E F</span>
                            </div>

                            {Object.entries(rows).map(([row, rowSeats]) => {
                                const left  = rowSeats.filter(s => LEFT_SEATS.includes(s.seatNumber.slice(-1)));
                                const right = rowSeats.filter(s => RIGHT_SEATS.includes(s.seatNumber.slice(-1)));

                                return (
                                    <div key={row} className="seat-row">
                                        <span className="seat-row-label">{row}</span>
                                        <div className="seat-row-seats">
                                            <div className="seat-group">{left.map(renderSeat)}</div>
                                            <div className="seat-aisle" />
                                            <div className="seat-group">{right.map(renderSeat)}</div>
                                        </div>
                                    </div>
                                );
                            })}
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
                            {submitting ? "Initiating payment..." : "Confirm Booking"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}