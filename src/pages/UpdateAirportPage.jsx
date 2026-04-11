import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AirportForm from "../components/AirportForm";
import { getAirportById, updateAirport } from "../api/airportApi";
import { useFormErrors } from "../components/useFormErrors";
import "./AirportFormPage.css";

function UpdateAirportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [airport, setAirport] = useState(null);
  const {generalError,fieldErrors,clearErrors,clearFieldError,handleApiError} = useFormErrors();

  useEffect(() => {
    loadAirport();
  }, []);

  async function loadAirport() {
    try{
        clearErrors();
        const data = await getAirportById(id);
        setAirport(data);
    } catch (error) {
        handleApiError(error);
    }
  }

  async function handleUpdateAirport(updatedAirport) {
      try{
           clearErrors();
           await updateAirport(id, updatedAirport);
           navigate("/airports");
      } catch(error){
          handleApiError(error);
      }
  }

  if (!airport) {
    return (
      <div className="airport-loading-page">
        <div className="airport-loading-card">Loading airport...</div>
      </div>
    );
  }

  return (
    <div className="airport-form-layout">
      <div className="airport-form-container">
        <div className="airport-form-card">
          <div className="airport-form-header">
            <h1 className="airport-form-title">Update Airport</h1>
          </div>

          <AirportForm
            onSubmit={handleUpdateAirport}
            initialData={airport}
            submitLabel="Update Airport"
            showCancel={true}
            onCancel={() => navigate("/airports")}
            generalError={generalError}
            fieldErrors={fieldErrors}
            clearFieldError={clearFieldError}
          />
        </div>
      </div>
    </div>
  );
}

export default UpdateAirportPage;