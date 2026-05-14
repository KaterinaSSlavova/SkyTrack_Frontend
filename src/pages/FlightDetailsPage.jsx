import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getDuffelFlightById, updateFlightGate, updateFlightStatus } from "../api/flightApi";
import "./FlightDetailsPage.css";

export default function FlightDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [gate, setGate] = useState("");
    const [status, setStatus] = useState("SCHEDULED");
    const [departureTime, setDepartureTime] = useState("");

    useEffect(() => {
        async function loadFlight() {
            try {
                const response = await getDuffelFlightById(id);
                setFlight(response);
                setGate(response.gate ?? "");
                setStatus(response.status ?? "SCHEDULED");

                if (response.departureLocalTime) {
                    const d = new Date(response.departureLocalTime);
                    const hh = String(d.getHours()).padStart(2, "0");
                    const mm = String(d.getMinutes()).padStart(2, "0");
                    setDepartureTime(`${hh}:${mm}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadFlight();
    }, [id]);

async function handleSave() {
    try {
        const originalGate = flight.gate ?? "";
        if (gate.trim() !== "" && gate.trim() !== originalGate.trim()) {
            await updateFlightGate(id, gate.trim());
        }

        let fullDepartureTime = null;
        if (departureTime) {
            const existingDate = flight.departureLocalTime
                ? flight.departureLocalTime.substring(0, 10)
                : new Date().toISOString().substring(0, 10);
            fullDepartureTime = `${existingDate}T${departureTime}`;
        }

        await updateFlightStatus(id, status, fullDepartureTime);
        navigate("/flights");
    } catch (error) {
        console.error(error);
    }
}

    function formatDateTime(isoString) {
        if (!isoString) return "—";
        const d = new Date(isoString);
        return d.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    if (!flight) {
        return (
            <div className="flight-details-page">
                <Sidebar />
                <div className="flight-details-content">
                    <p className="loading-text">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flight-details-page">
            <Sidebar />

            <div className="flight-details-content">
                <div className="flight-details-card">

                    <div className="flight-details-header">
                        <div>
                            <p className="flight-details-label">FLIGHT DETAILS</p>
                            <h1 className="flight-details-title">{flight.flightNumber}</h1>
                        </div>
                        <button className="back-button" onClick={() => navigate("/flights")}>
                            ← Back to flights
                        </button>
                    </div>

                    <div className="flight-info-grid">
                        <div className="info-cell">
                            <span className="cell-label">FROM</span>
                            <p className="cell-value">{flight.departureIataCode}</p>
                        </div>
                        <div className="info-cell">
                            <span className="cell-label">TO</span>
                            <p className="cell-value">{flight.arrivalIataCode}</p>
                        </div>
                        <div className="info-cell">
                            <span className="cell-label">DEPARTURE</span>
                            <p className="cell-value">{formatDateTime(flight.departureLocalTime)}</p>
                        </div>
                        <div className="info-cell">
                            <span className="cell-label">ARRIVAL</span>
                            <p className="cell-value">{formatDateTime(flight.arrivalLocalTime)}</p>
                        </div>
                    </div>

                    <div className="flight-info-grid flight-info-grid--three">
                        <div className="info-cell">
                            <span className="cell-label">PRICE</span>
                            <p className="cell-value">{flight.currency} {flight.price}</p>
                        </div>
                        <div className="info-cell">
                            <span className="cell-label">GATE</span>
                            <p className="cell-value">{flight.gate || "—"}</p>
                        </div>
                        <div className="info-cell">
                            <span className="cell-label">STATUS</span>
                            <p className={`status-badge status-badge--${flight.status?.toLowerCase()}`}>
                                {flight.status}
                            </p>
                        </div>
                    </div>

                    <h2 className="edit-title">Edit flight</h2>

                    <div className="flight-form-section">
                        <div className="form-field">
                            <label className="form-label">Gate</label>
                            <input
                                className="form-input"
                                value={gate}
                                onChange={(e) => setGate(e.target.value)}
                                placeholder="e.g. B12"
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Status</label>
                            <select
                                className="form-input form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="SCHEDULED">SCHEDULED</option>
                                <option value="DELAYED">DELAYED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Departure time</label>
                            <input
                                className="form-input"
                                type="time"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flight-actions">
                        <button className="save-button" onClick={handleSave}>
                            Save changes
                        </button>
                        <button className="cancel-button" onClick={() => navigate("/flights")}>
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}