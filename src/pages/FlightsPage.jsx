import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllFlights, cancelFlight } from "../api/flightApi";
import "./FlightsPage.css";

export default function FlightsPage() {
    const [flights, setFlights] = useState([]);
    const navigate = useNavigate();

    async function loadFlights() {
        try {
            const response = await getAllFlights();
            setFlights(response.flights ?? response);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadFlights();
    }, []);

    async function handleCancelFlight(id) {
        try {
            await cancelFlight(id);
            await loadFlights();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flights-page">
            <Sidebar />

            <div className="flights-content">
                <div className="flights-inner">
                    <div className="flights-header">
                        <div>
                            <h1 className="flights-title">Flights Overview</h1>
                            <p className="flights-subtitle">
                                Manage all flights in the system.
                            </p>
                        </div>

                        <button
                            className="create-flight-button"
                            onClick={() => navigate("/flights/create")}
                        >
                            Create Flight
                        </button>
                    </div>

                    <div className="flights-table-card">
                        <table className="flights-table">
                            <thead>
                                <tr>
                                    <th>Flight Number</th>
                                    <th>Departure</th>
                                    <th>Arrival</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {flights.map((flight) => (
                                    <tr key={flight.id}>
                                        <td>{flight.flightNumber}</td>
                                        <td>{flight.departureIataCode}</td>
                                        <td>{flight.arrivalIataCode}</td>
                                        <td>€{flight.price}</td>
                                        <td>{flight.status}</td>
                                        <td>
                                            <div className="flight-actions">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/flights/update/${flight.id}`)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleCancelFlight(flight.id)
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {flights.length === 0 && (
                            <p className="no-flights-text">No flights found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}