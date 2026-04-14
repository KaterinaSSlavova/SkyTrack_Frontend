export default function FlightSearchForm({
    departureInput,
    arrivalInput,
    departureDate,
    departureResults,
    arrivalResults,
    onDepartureChange,
    onArrivalChange,
    onDepartureDateChange,
    onSelectDepartureAirport,
    onSelectArrivalAirport,
    onSearch
}) {
    return (
        <div className="search-box">
            <div className="search-field-group search-field-with-dropdown">
                <label className="search-label">From</label>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Amsterdam"
                    value={departureInput}
                    onChange={(e) => onDepartureChange(e.target.value)}
                />

                {departureResults.length > 0 && (
                    <div className="search-dropdown">
                        {departureResults.map((airport) => (
                            <div
                                key={airport.id}
                                className="search-dropdown-item"
                                onClick={() => onSelectDepartureAirport(airport)}
                            >
                                {airport.name} ({airport.iataCode}) - {airport.city}, {airport.country}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="search-arrow-circle">→</div>

            <div className="search-field-group search-field-with-dropdown">
                <label className="search-label">To</label>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rome"
                    value={arrivalInput}
                    onChange={(e) => onArrivalChange(e.target.value)}
                />

                {arrivalResults.length > 0 && (
                    <div className="search-dropdown">
                        {arrivalResults.map((airport) => (
                            <div
                                key={airport.id}
                                className="search-dropdown-item"
                                onClick={() => onSelectArrivalAirport(airport)}
                            >
                                {airport.name} ({airport.iataCode}) - {airport.city}, {airport.country}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="search-field-group">
                <label className="search-label">Date</label>
                <input
                    type="date"
                    className="search-input"
                    value={departureDate}
                    onChange={(e) => onDepartureDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    onClick={(e) => e.target.showPicker()}
                />
            </div>

            <button className="search-button" onClick={onSearch}>
                Search
            </button>
        </div>
    );
}