import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllDuffelFlights } from "../api/flightApi";
import "./FlightsPage.css";

export default function FlightsPage() {
    const [flights, setFlights] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadFlights() {
            try {
                const response = await getAllDuffelFlights();
                setFlights(response.flights ?? response);
            } catch (error) {
                console.error(error);
            }
        }
        loadFlights();
    }, []);

    function formatDateTime(dt) {
        if (!dt) return "—";
        return new Date(dt).toLocaleString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    }

    return (
        <div className="flights-page">
            <Sidebar />
            <div className="flights-content">
                <div className="flights-card">
                    <div className="flights-header">
                        <h1 className="flights-title">Flights</h1>
                    </div>

                    <div className="flights-table-wrapper">
                        <table className="flights-table">
                            <colgroup>
                                <col className="col-flight" />
                                <col className="col-route" />
                                <col className="col-departure" />
                                <col className="col-arrival" />
                                <col className="col-price" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>Flight</th>
                                    <th>Route</th>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight) => (
                                    <tr
                                        key={flight.id}
                                        className="flight-row"
                                        onClick={() => navigate(`/flights/${flight.id}`)}
                                    >
                                        <td className="flight-number-cell">{flight.flightNumber}</td>
                                        <td>{flight.departureIataCode} → {flight.arrivalIataCode}</td>
                                        <td>{formatDateTime(flight.departureLocalTime)}</td>
                                        <td>{formatDateTime(flight.arrivalLocalTime)}</td>
                                        <td>{flight.currency} {flight.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {flights.length === 0 && (
                            <p className="flights-empty">No saved flights found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}