import { useEffect, useState } from "react";
import "./AirportForm.css";

const EMPTY_AIRPORT = {
  iataCode: "",
  name: "",
  city: "",
  country: "",
  timezone: ""
};

const TIMEZONES = [
  "Europe/Amsterdam",
  "Europe/Rome",
  "Europe/Athens",
  "Europe/Paris",
  "Europe/Madrid",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Australia/Sydney"
];

function AirportForm({
  onSubmit,
  initialData,
  submitLabel = "Save Airport",
  onCancel,
  showCancel = false,
  generalError = "",
  fieldErrors = {},
  clearFieldError
}) {
  const [airport, setAirport] = useState(initialData ?? EMPTY_AIRPORT);

  useEffect(() => {
    setAirport(initialData ?? EMPTY_AIRPORT);
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;

    setAirport((prev) => ({
      ...prev,
      [name]: value
    }));

    if (clearFieldError) {
      clearFieldError(name);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(airport);
  }

  return (
    <div className="airport-form-page">
      <form onSubmit={handleSubmit} className="airport-form">
        {generalError && (
          <p className="airport-general-error">{generalError}</p>
        )}

        <input
          name="iataCode"
          placeholder="Iata Code"
          value={airport.iataCode}
          onChange={handleChange}
          className={`airport-input ${fieldErrors.iataCode ? "airport-input-error" : ""}`}
        />
        {fieldErrors.iataCode && (
          <p className="airport-field-error">{fieldErrors.iataCode}</p>
        )}

        <input
          name="name"
          placeholder="Airport Name"
          value={airport.name}
          onChange={handleChange}
          className={`airport-input ${fieldErrors.name ? "airport-input-error" : ""}`}
        />
        {fieldErrors.name && (
          <p className="airport-field-error">{fieldErrors.name}</p>
        )}

        <input
          name="city"
          placeholder="City"
          value={airport.city}
          onChange={handleChange}
          className={`airport-input ${fieldErrors.city ? "airport-input-error" : ""}`}
        />
        {fieldErrors.city && (
          <p className="airport-field-error">{fieldErrors.city}</p>
        )}

        <input
          name="country"
          placeholder="Country"
          value={airport.country}
          onChange={handleChange}
          className={`airport-input ${fieldErrors.country ? "airport-input-error" : ""}`}
        />
        {fieldErrors.country && (
          <p className="airport-field-error">{fieldErrors.country}</p>
        )}

        <select
          name="timezone"
          value={airport.timezone}
          onChange={handleChange}
          className={`airport-input ${fieldErrors.timezone ? "airport-input-error" : ""}`}
        >
          <option value="">Select timezone</option>
          {TIMEZONES.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
        {fieldErrors.timezone && (
          <p className="airport-field-error">{fieldErrors.timezone}</p>
        )}

        <div className="airport-form-buttons">
          <button type="submit" className="airport-button">
            {submitLabel}
          </button>

          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="airport-cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AirportForm;