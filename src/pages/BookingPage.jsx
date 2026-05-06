import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import "./BookingPage.css";

function formatTime(value) {
    if (!value) return "--:--";
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export default function BookingPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const flight = state?.flight;
    const dbFlightId = state?.dbFlightId;
    console.log("dbFlightId on booking page:", dbFlightId);

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

    const handleChange = (e) => {
        setPassenger(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

   const handleSubmit = async (e) => {
       e.preventDefault();
       navigate("/booking/seats", { state: { flight, passenger, dbFlightId } });
   };

    if (!flight) return <p>No flight selected.</p>;

 return (
     <div className="booking-page">
         <Sidebar />
         <div className="booking-content">
             <h2 className="booking-title">Book Flight</h2>

             <div className="booking-flight-summary">
                 <div>
                     <p className="booking-summary-route">{flight.departureIataCode} → {flight.arrivalIataCode}</p>
                     <p className="booking-summary-detail">{flight.flightNumber} · {formatTime(flight.departureLocalTime)} – {formatTime(flight.arrivalLocalTime)}</p>
                 </div>
                 <div>
                     <p className="booking-summary-price">€{flight.price}</p>
                     <p className="booking-summary-per-person">per person</p>
                 </div>
             </div>

             <div className="booking-form-card">
                 <h3 className="booking-section-title">Passenger Details</h3>
                 <form onSubmit={handleSubmit}>
                     <div className="booking-form-grid">
                         <div className="booking-field">
                             <label className="booking-label">First Name</label>
                             <input className="booking-input" name="firstName" placeholder="John" value={passenger.firstName} onChange={handleChange} required />
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Last Name</label>
                             <input className="booking-input" name="lastName" placeholder="Doe" value={passenger.lastName} onChange={handleChange} required />
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Email</label>
                             <input className="booking-input" name="email" type="email" placeholder="john@example.com" value={passenger.email} onChange={handleChange} required />
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Gender</label>
                             <select className="booking-select" name="gender" value={passenger.gender} onChange={handleChange} required>
                                 <option value="">Select Gender</option>
                                 <option value="MALE">Male</option>
                                 <option value="FEMALE">Female</option>
                                 <option value="UNSPECIFIED">Unspecified</option>
                             </select>
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Passport Number</label>
                             <input className="booking-input" name="passportNumber" placeholder="AB123456" value={passenger.passportNumber} onChange={handleChange} required />
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Nationality</label>
                             <input className="booking-input" name="nationality" placeholder="Dutch" value={passenger.nationality} onChange={handleChange} required />
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Date of Birth</label>
                             <input className="booking-input" name="dateOfBirth" type="date" value={passenger.dateOfBirth} onChange={handleChange} required />
                         </div>
                         <div className="booking-field">
                             <label className="booking-label">Passport Expiry</label>
                             <input className="booking-input" name="passportExpiry" type="date" value={passenger.passportExpiry} onChange={handleChange} required />
                         </div>
                     </div>

                     <button type="submit" className="booking-submit-btn">
                         Confirm
                     </button>
                 </form>
             </div>
         </div>
     </div>
 );
}