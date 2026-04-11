import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { searchFlights } from "../api/flightApi";
import { searchAirports } from "../api/airportApi";
import FlightSearchForm from "../components/FlightSearchForm";
import FlightSearchResult from "../components/FlightSearchResult";
import "./SearchFlightsPage.css";

export default function SearchFlightsPage() {
    const [departureInput, setDepartureInput] = useState("");
    const [arrivalInput, setArrivalInput] = useState("");
    const [departureDate, setDepartureDate] = useState("");

    const [departureResults, setDepartureResults] = useState([]);
    const [arrivalResults, setArrivalResults] = useState([]);

    const [selectedDepartureAirport, setSelectedDepartureAirport] = useState(null);
    const [selectedArrivalAirport, setSelectedArrivalAirport] = useState(null);

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    const handleDepartureChange = async (value) => {
        setDepartureInput(value);
        setSelectedDepartureAirport(null);

        if (!value.trim()) {
            setDepartureResults([]);
            return;
        }

        try {
            const response = await searchAirports(value);
            setDepartureResults(response);
        } catch (err) {
            console.error(err);
            setDepartureResults([]);
        }
    };

    const handleArrivalChange = async (value) => {
        setArrivalInput(value);
        setSelectedArrivalAirport(null);

        if (!value.trim()) {
            setArrivalResults([]);
            return;
        }

        try {
            const response = await searchAirports(value);
            setArrivalResults(response);
        } catch (err) {
            console.error(err);
            setArrivalResults([]);
        }
    };

    const handleSelectDepartureAirport = (airport) => {
        setSelectedDepartureAirport(airport);
        setDepartureInput(`${airport.city} (${airport.iataCode})`);
        setDepartureResults([]);
    };

    const handleSelectArrivalAirport = (airport) => {
        setSelectedArrivalAirport(airport);
        setArrivalInput(`${airport.city} (${airport.iataCode})`);
        setArrivalResults([]);
    };

    const handleSearch = async () => {
        setError("");
        setHasSearched(true);

        console.log("selectedDepartureAirport:", selectedDepartureAirport);
        console.log("selectedArrivalAirport:", selectedArrivalAirport);
        console.log("departureDate:", departureDate);

        if (!selectedDepartureAirport || !selectedArrivalAirport || !departureDate) {
            setError("Please fill all fields.");
            setFlights([]);
            return;
        }

        try {
            setLoading(true);

            const response = await searchFlights(
                selectedDepartureAirport.iataCode,
                selectedArrivalAirport.iataCode,
                departureDate
            );

            setFlights(response);
        } catch (err) {
            setError("Flight search failed.");
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-flights-page">
            <Sidebar />

            <div className="search-flights-content">
                <div className="search-flights-header">
                    <h1 className="search-flights-title">Search Flights</h1>
                </div>

                <FlightSearchForm
                    departureInput={departureInput}
                    arrivalInput={arrivalInput}
                    departureDate={departureDate}
                    departureResults={departureResults}
                    arrivalResults={arrivalResults}
                    onDepartureChange={handleDepartureChange}
                    onArrivalChange={handleArrivalChange}
                    onDepartureDateChange={setDepartureDate}
                    onSelectDepartureAirport={handleSelectDepartureAirport}
                    onSelectArrivalAirport={handleSelectArrivalAirport}
                    onSearch={handleSearch}
                />

                {error && <p className="search-error">{error}</p>}
                {loading && <p className="search-loading">Searching flights...</p>}

                <FlightSearchResult
                    flights={flights}
                    loading={loading}
                    error={error}
                    hasSearched={hasSearched}
                />
            </div>
        </div>
    );
}