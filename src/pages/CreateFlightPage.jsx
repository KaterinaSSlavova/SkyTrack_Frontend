import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FlightForm from "../components/FlightForm";
import { createFlight } from "../api/flightApi";
import { getAllAirports } from "../api/airportApi";
import "./FlightFormPage.css";

export default function CreateFlightPage() {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [statuses] = useState([
        { id: 1, name: "SCHEDULED" },
        { id: 2, name: "DELAYED" },
        { id: 3, name: "CANCELLED" }
    ]);
    const {generalError,fieldErrors,clearErrors,clearFieldError,handleApiError} = useFormErrors();

    useEffect(() => {
        async function loadAirports() {
              try {
                  clearErrors();
                  const response = await getAllAirports();
                  setAirports(response.airports ?? response);
              } catch (error) {
                  handleApiError(error);
              }
        }

        loadAirports();
    }, []);

    async function handleCreateFlight(flight) {
        try {
            clearErrors();
            await createFlight(flight);
            navigate("/flights");
        } catch (error) {
            handleApiError(error);
        }
    }

    return (
        <div className="flight-form-layout">
            <Sidebar />

            <div className="flight-form-container">
                <div className="flight-form-card">
                    <div className="flight-form-header">
                        <h1 className="flight-form-title">Create Flight</h1>
                    </div>

                    <FlightForm
                        onSubmit={handleCreateFlight}
                        submitLabel="Create Flight"
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