import { useEffect, useState } from "react";
import "./FlightForm.css";

const EMPTY_FLIGHT = {
    flightNumber: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureLocalTime: "",
    arrivalLocalTime: "",
    gate: "",
    terminal: "",
    price: "",
    capacity: "",
    statusId: ""
};

export default function FlightForm({
    onSubmit,
    initialData,
    submitLabel = "Save Flight",
    onCancel,
    showCancel = false,
    airports = [],
    statuses = [],
    generalError = "",
    fieldErrors = {},
    clearFieldError
}) {
    const [flight, setFlight] = useState(initialData ?? EMPTY_FLIGHT);

    useEffect(() => {
        setFlight(initialData ?? EMPTY_FLIGHT);
    }, [initialData]);

    function handleChange(e) {
        const { name, value } = e.target;

        setFlight((prev) => ({
            ...prev,
            [name]: value
        }));

        if (clearFieldError) {
            clearFieldError(name);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await onSubmit(flight);
    }

    return (
        <form className="flight-form" onSubmit={handleSubmit}>
            {generalError && (
                <p className="flight-general-error">{generalError}</p>
            )}

            <input
                name="flightNumber"
                placeholder="Flight Number"
                value={flight.flightNumber}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.flightNumber ? "flight-input-error" : ""}`}
            />
            {fieldErrors.flightNumber && (
                <p className="flight-field-error">{fieldErrors.flightNumber}</p>
            )}

            <select
                name="departureAirportId"
                value={flight.departureAirportId}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.departureAirportId ? "flight-input-error" : ""}`}
            >
                <option value="">Select departure airport</option>
                {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                        {airport.name} ({airport.iataCode})
                    </option>
                ))}
            </select>
            {fieldErrors.departureAirportId && (
                <p className="flight-field-error">{fieldErrors.departureAirportId}</p>
            )}

            <select
                name="arrivalAirportId"
                value={flight.arrivalAirportId}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.arrivalAirportId ? "flight-input-error" : ""}`}
            >
                <option value="">Select arrival airport</option>
                {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                        {airport.name} ({airport.iataCode})
                    </option>
                ))}
            </select>
            {fieldErrors.arrivalAirportId && (
                <p className="flight-field-error">{fieldErrors.arrivalAirportId}</p>
            )}

            <input
                type="datetime-local"
                name="departureLocalTime"
                value={flight.departureLocalTime}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.departureLocalTime ? "flight-input-error" : ""}`}
            />
            {fieldErrors.departureLocalTime && (
                <p className="flight-field-error">{fieldErrors.departureLocalTime}</p>
            )}

            <input
                type="datetime-local"
                name="arrivalLocalTime"
                value={flight.arrivalLocalTime}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.arrivalLocalTime ? "flight-input-error" : ""}`}
            />
            {fieldErrors.arrivalLocalTime && (
                <p className="flight-field-error">{fieldErrors.arrivalLocalTime}</p>
            )}

            <input
                name="gate"
                placeholder="Gate"
                value={flight.gate}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.gate ? "flight-input-error" : ""}`}
            />
            {fieldErrors.gate && (
                <p className="flight-field-error">{fieldErrors.gate}</p>
            )}

            <input
                name="terminal"
                placeholder="Terminal"
                value={flight.terminal}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.terminal ? "flight-input-error" : ""}`}
            />
            {fieldErrors.terminal && (
                <p className="flight-field-error">{fieldErrors.terminal}</p>
            )}

            <input
                type="number"
                name="price"
                placeholder="Price"
                value={flight.price}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.price ? "flight-input-error" : ""}`}
            />
            {fieldErrors.price && (
                <p className="flight-field-error">{fieldErrors.price}</p>
            )}

            <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={flight.capacity}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.capacity ? "flight-input-error" : ""}`}
            />
            {fieldErrors.capacity && (
                <p className="flight-field-error">{fieldErrors.capacity}</p>
            )}

            <select
                name="statusId"
                value={flight.statusId}
                onChange={handleChange}
                className={`flight-input ${fieldErrors.statusId ? "flight-input-error" : ""}`}
            >
                <option value="">Select status</option>
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.name}
                    </option>
                ))}
            </select>
            {fieldErrors.statusId && (
                <p className="flight-field-error">{fieldErrors.statusId}</p>
            )}

            <div className="flight-form-buttons">
                <button type="submit" className="flight-button">
                    {submitLabel}
                </button>

                {showCancel && (
                    <button
                        type="button"
                        className="flight-cancel-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}