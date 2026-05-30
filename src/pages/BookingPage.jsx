import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { validatePassenger } from "../api/passengerApi";
import "./BookingPage.css";

function formatTime(value) {
    if (!value) return "--:--";

    const date = new Date(value);

    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export default function BookingPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const flight = state?.flight;
    const dbFlightId = state?.dbFlightId;

    const [passenger, setPassenger] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        passportNumber: "",
        dateOfBirth: "",
        passportExpiry: "",
        nationality: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const todayDate = new Date();

    const today = todayDate
        .toISOString()
        .split("T")[0];

    const tomorrowDate = new Date(todayDate);
    tomorrowDate.setDate(
        tomorrowDate.getDate() + 1
    );

    const tomorrow = tomorrowDate
        .toISOString()
        .split("T")[0];

    const handleChange = (e) => {
        let value = e.target.value;

        if (e.target.name === "passportNumber") {
            value = value.toUpperCase();
        }

        setPassenger((prev) => ({
            ...prev,
            [e.target.name]: value,
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);
        setError("");

        await validatePassenger(passenger, flight.departureLocalTime);

        navigate("/booking/seats", {
            state: {
                flight,
                passenger,
                dbFlightId,
            },
        });
    } catch (err) {
        setError(
            err.response?.data?.message ||
            "Passenger validation failed."
        );
    } finally {
        setLoading(false);
    }
};

    if (!flight) {
        return <p>No flight selected.</p>;
    }

    return (
        <div className="booking-page">
            <Sidebar />

            <div className="booking-content">

                <Topbar
                    onProfileClick={() =>
                        navigate("/profile")
                    }
                />

                <h2 className="booking-title">
                    Book Flight
                </h2>

                <div className="booking-flight-summary">

                    <div>
                        <p className="booking-summary-route">
                            {flight.departureIataCode}
                            {" → "}
                            {flight.arrivalIataCode}
                        </p>

                        <p className="booking-summary-detail">
                            {flight.flightNumber}
                            {" · "}
                            {formatTime(flight.departureLocalTime)}
                            {" – "}
                            {formatTime(flight.arrivalLocalTime)}
                        </p>
                    </div>

                    <div>
                        <p className="booking-summary-price">
                            €{flight.price}
                        </p>

                        <p className="booking-summary-per-person">
                            per person
                        </p>
                    </div>

                </div>

                <div className="booking-form-card">

                    <h3 className="booking-section-title">
                        Passenger Details
                    </h3>

                    <form onSubmit={handleSubmit}>

                        <div className="booking-form-grid">

                            <div className="booking-field">
                                <label className="booking-label">
                                    First Name
                                </label>

                                <input
                                    className="booking-input"
                                    name="firstName"
                                    placeholder="John"
                                    value={passenger.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label className="booking-label">
                                    Last Name
                                </label>

                                <input
                                    className="booking-input"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={passenger.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="booking-field">
                                <label className="booking-label">
                                    Email
                                </label>

                                <input
                                    className="booking-input"
                                    type="email"
                                    placeholder="john.doe@email.com"
                                    name="email"
                                    value={passenger.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="booking-field">

                                <label className="booking-label">
                                    Gender
                                </label>

                                <select
                                    className="booking-select"
                                    name="gender"
                                    value={passenger.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="MALE">
                                        Male
                                    </option>

                                    <option value="FEMALE">
                                        Female
                                    </option>

                                    <option value="UNSPECIFIED">
                                        Unspecified
                                    </option>

                                </select>

                            </div>

                            <div className="booking-field">

                                <label className="booking-label">
                                    Passport Number
                                </label>

                                <input
                                    className="booking-input"
                                    name="passportNumber"
                                    placeholder="AB123456"
                                    value={passenger.passportNumber}
                                    onChange={handleChange}
                                    minLength={6}
                                    maxLength={12}
                                    pattern="[A-Za-z0-9]+"
                                    required
                                />

                            </div>

                            <div className="booking-field">

                                <label className="booking-label">
                                    Nationality
                                </label>

                                <input
                                    className="booking-input"
                                    name="nationality"
                                    placeholder="Dutch"
                                    value={passenger.nationality}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="booking-field">

                                <label className="booking-label">
                                    Date of Birth
                                </label>

                                <input
                                    className="booking-input"
                                    name="dateOfBirth"
                                    type="date"
                                    value={passenger.dateOfBirth}
                                    onChange={handleChange}
                                    onClick={(e) =>
                                        e.target.showPicker()
                                    }
                                    max={today}
                                    required
                                />

                            </div>

                            <div className="booking-field">

                                <label className="booking-label">
                                    Passport Expiry
                                </label>

                                <input
                                    className="booking-input"
                                    name="passportExpiry"
                                    type="date"
                                    value={passenger.passportExpiry}
                                    onChange={handleChange}
                                    onClick={(e) =>
                                        e.target.showPicker()
                                    }
                                    min={tomorrow}
                                    required
                                />

                            </div>

                        </div>

                        {error && (
                            <p className="booking-error">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="booking-submit-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Checking..."
                                : "Confirm"}
                        </button>

                    </form>

                </div>

            </div>
        </div>
    );
}