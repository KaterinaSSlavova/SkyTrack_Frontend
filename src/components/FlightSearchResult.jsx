import { useState } from "react";
import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveDuffelFlight } from "../api/flightApi";

function formatTime(value) {
    if (!value) return "--:--";
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

const TIME_SLOTS = [
    { label: "Early morning", sub: "00:00–06:00", start: 0, end: 6 },
    { label: "Morning",       sub: "06:00–12:00", start: 6, end: 12 },
    { label: "Afternoon",     sub: "12:00–18:00", start: 12, end: 18 },
    { label: "Evening",       sub: "18:00–24:00", start: 18, end: 24 },
];

function getSlotIndex(dateStr) {
    const h = new Date(dateStr).getHours();
    if (h < 6)  return 0;
    if (h < 12) return 1;
    if (h < 18) return 2;
    return 3;
}

function getMaxPrice(flights) {
    if (!flights.length) return 1000;
    return Math.ceil(Math.max(...flights.map(f => f.price)) / 50) * 50;
}

export default function FlightSearchResult({ flights = [], loading = false, error = "", hasSearched = false }) {
    const navigate = useNavigate();

    const [activeSlots, setActiveSlots] = useState(new Set());
    const [maxPrice, setMaxPrice] = useState(null);

    const priceMax = maxPrice ?? getMaxPrice(flights);

    const toggleSlot = (i) => {
        setActiveSlots(prev => {
            const next = new Set(prev);
            next.has(i) ? next.delete(i) : next.add(i);
            return next;
        });
    };

    const filteredFlights = flights.filter(f => {
        const slotOk = activeSlots.size === 0 || activeSlots.has(getSlotIndex(f.departureLocalTime));
        const priceOk = f.price <= priceMax;
        return slotOk && priceOk;
    });

    const handleFlightClick = async (flight) => {
        const savedFlight = await saveDuffelFlight(flight);
        navigate("/booking", { state: { flight: savedFlight, dbFlightId: savedFlight.id } });
    };

    return (
        <div className="flight-results">
            {flights.length > 0 && (
                <>
                    <h2 className="results-title">Available Flights</h2>

                    <div className="flight-filters">
                        <div className="filter-section">
                            <span className="filter-label">Departure time</span>
                            <div className="time-chips">
                                {TIME_SLOTS.map((slot, i) => (
                                    <button
                                        key={i}
                                        className={`time-chip${activeSlots.has(i) ? " time-chip--active" : ""}`}
                                        onClick={() => toggleSlot(i)}
                                    >
                                        <span className="time-chip-label">{slot.label}</span>
                                        <span className="time-chip-sub">{slot.sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <span className="filter-label">
                                Max price:&nbsp;
                                <span className="filter-price-value">
                                    {new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(priceMax)}
                                </span>
                            </span>
                            <div className="price-range-row">
                                <span className="price-range-edge">€0</span>
                                <input
                                    type="range"
                                    className="price-slider"
                                    min={0}
                                    max={getMaxPrice(flights)}
                                    step={10}
                                    value={priceMax}
                                    onChange={e => setMaxPrice(Number(e.target.value))}
                                />
                                <span className="price-range-edge">
                                    {new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(getMaxPrice(flights))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {filteredFlights.length > 0 ? (
                        filteredFlights.map((flight) => (
                            <div
                                key={flight.externalId}
                                className="flight-card"
                                onClick={() => handleFlightClick(flight)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="flight-row">
                                    <div className="flight-left">
                                        <p className="flight-airline">SkyTrack Air</p>
                                        <p className="flight-number">{flight.flightNumber}</p>
                                    </div>

                                    <div className="flight-time-block">
                                        <p className="flight-time">{formatTime(flight.departureLocalTime)}</p>
                                        <p className="flight-iata">{flight.departureIataCode}</p>
                                    </div>

                                    <div className="flight-middle">
                                        <Plane size={20} className="flight-plane-icon" />
                                        <p className="flight-direct">Direct</p>
                                    </div>

                                    <div className="flight-time-block">
                                        <p className="flight-time">{formatTime(flight.arrivalLocalTime)}</p>
                                        <p className="flight-iata">{flight.arrivalIataCode}</p>
                                    </div>

                                    <div className="flight-price-block">
                                        <p className="flight-price">
                                            {new Intl.NumberFormat("en-GB", {
                                                style: "currency",
                                                currency: flight.currency
                                            }).format(flight.price)}
                                        </p>
                                        <p className="flight-per-person">per person</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-results">
                            No flights match your filters.
                        </div>
                    )}
                </>
            )}

            {!loading && !error && hasSearched && flights.length === 0 && (
                <div className="empty-results">No matching flights found.</div>
            )}

            {!loading && !error && !hasSearched && (
                <div className="empty-results">No flights searched yet.</div>
            )}
        </div>
    );
}