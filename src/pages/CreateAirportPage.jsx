import { useNavigate } from "react-router-dom";
import AirportForm from "../components/AirportForm";
import { createAirport } from "../api/airportApi";
import { useFormErrors } from "../components/useFormErrors";
import "./AirportFormPage.css";

function CreateAirportPage() {
  const navigate = useNavigate();
  const {generalError,fieldErrors,clearErrors,clearFieldError,handleApiError} = useFormErrors();

   async function handleCreateAirport(airport) {
     try {
       clearErrors();
       await createAirport(airport);
       navigate("/airports");
     } catch (error) {
       handleApiError(error);
     }
   }

  return (
    <div className="airport-form-layout">
      <div className="airport-form-container">
        <div className="airport-form-card">
          <div className="airport-form-header">
            <h1 className="airport-form-title">Create Airport</h1>
          </div>

          <AirportForm
            onSubmit={handleCreateAirport}
            submitLabel="Create Airport"
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

export default CreateAirportPage;