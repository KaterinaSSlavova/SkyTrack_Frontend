import { Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveDuffelFlight } from "../api/flightApi";

function formatTime(value) {
    if (!value) return "--:--";

    const date = new Date(value);

    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export default function FlightSearchResult({flights = [],loading = false,error = "",hasSearched = false}) {
    const navigate = useNavigate();
  const handleFlightClick = async (flight) => {
      const savedFlight = await saveDuffelFlight(flight);
      navigate("/booking", { state: { flight: savedFlight, dbFlightId: savedFlight.id }});
  };

    return (
        <div className="flight-results">
            {flights.length > 0 && (
                <>
                    <h2 className="results-title">Available Flights</h2>

                   {flights.map((flight) => (
                       <div key={flight.externalId} className="flight-card" onClick={() => handleFlightClick(flight)} style={{cursor: "pointer"}}>
                           <div className="flight-row">

                               <div className="flight-left">
                                   <p className="flight-airline">SkyTrack Air</p>
                                   <p className="flight-number">{flight.flightNumber}</p>
                               </div>

                               <div className="flight-time-block">
                                   <p className="flight-time">
                                       {formatTime(flight.departureLocalTime)}
                                   </p>
                                   <p className="flight-iata">{flight.departureIataCode}</p>
                               </div>

                               <div className="flight-middle">
                                   <Plane size={20} className="flight-plane-icon" />
                                   <p className="flight-direct">Direct</p>
                               </div>

                               <div className="flight-time-block">
                                   <p className="flight-time">
                                       {formatTime(flight.arrivalLocalTime)}
                                   </p>
                                   <p className="flight-iata">{flight.arrivalIataCode}</p>
                               </div>

                               <div className="flight-price-block">
                                   <p className="flight-price">
                                       {new Intl.NumberFormat('en-GB', {
                                           style: 'currency',
                                           currency: flight.currency
                                       }).format(flight.price)}
                                   </p>
                                   <p className="flight-per-person">per person</p>
                               </div>

                           </div>
                       </div>
                   ))}
                </>
            )}

            {!loading && !error && hasSearched && flights.length === 0 && (
                <div className="empty-results">
                    No matching flights found.
                </div>
            )}

            {!loading && !error && !hasSearched && (
                <div className="empty-results">
                    No flights searched yet.
                </div>
            )}
        </div>
    );
}