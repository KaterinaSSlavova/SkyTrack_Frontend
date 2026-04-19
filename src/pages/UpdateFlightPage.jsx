import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FlightForm from "../components/FlightForm";
import { getFlightById, updateFlight } from "../api/flightApi";
import { getAllAirports } from "../api/airportApi";
import { useFormErrors } from "../components/useFormErrors";
import "./FlightFormPage.css";

export default function UpdateFlightPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [flight, setFlight] = useState(null);
    const [airports, setAirports] = useState([]);
    const [statuses] = useState([
        { id: 1, name: "SCHEDULED" },
        { id: 2, name: "DELAYED" },
        { id: 3, name: "CANCELLED" }
    ]);
    const {generalError,fieldErrors,clearErrors,clearFieldError,handleApiError} = useFormErrors();

    useEffect(() => {
        async function loadData() {
            try {
                clearErrors();
                const flightResponse = await getFlightById(id);
                const airportResponse = await getAllAirports();

                setFlight(flightResponse);
                setAirports(airportResponse.airports ?? airportResponse);
            } catch (error) {
                handleApiError(error);
            }
        }

        loadData();
    }, [id, clearErrors, handleApiError]);

    async function handleUpdateFlight(updatedFlight) {
        try{
             clearErrors();
             await updateFlight(id, updatedFlight);
             navigate("/flights");
        } catch(error){
            handleApiError(error);
        }
    }

    if (!flight) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flight-form-layout">
            <Sidebar />

            <div className="flight-form-container">
                <div className="flight-form-card">
                    <div className="flight-form-header">
                        <h1 className="flight-form-title">Update Flight</h1>
                    </div>

                    <FlightForm
                        onSubmit={handleUpdateFlight}
                        initialData={flight}
                        submitLabel="Update Flight"
                        showCancel={true}
                        onCancel={() => navigate("/flights")}
                        airports={airports}
                        statuses={statuses}
                        generalError={generalError}
                        fieldErrors={fieldErrors}
                        clearFieldError={clearFieldError}
                    />
                </div>
            </div>
        </div>
    );
}