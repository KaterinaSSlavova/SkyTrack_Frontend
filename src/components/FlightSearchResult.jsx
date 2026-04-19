import { Plane } from "lucide-react";

function formatTime(value) {
    if (!value) return "--:--";

    const date = new Date(value);

    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export default function FlightSearchResult({
    flights = [],
    loading = false,
    error = "",
    hasSearched = false
}) {
    return (
        <div className="flight-results">
            {flights.length > 0 && (
                <>
                    <h2 className="results-title">Available Flights</h2>

                   {flights.map((flight) => (
                       <div key={flight.id} className="flight-card">
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
                                   <p className="flight-price">€{flight.price}</p>
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