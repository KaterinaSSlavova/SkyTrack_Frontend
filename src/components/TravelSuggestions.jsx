import { useEffect, useState } from "react";
import {
  getTravelSuggestions,
  markCountryAsVisited,
} from "../api/mapApi";

export default function TravelSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  async function loadSuggestions() {
    const data = await getTravelSuggestions();
    setSuggestions(data || []);
  }

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function handleAdd(countryCode) {
    await markCountryAsVisited(countryCode);
    await loadSuggestions();
  }

  return (
    <div className="travel-suggestions">
      <button onClick={() => setOpen(!open)}>
        Suggestions
        {suggestions.length > 0 && <span> {suggestions.length}</span>}
      </button>

      {open && (
        <div className="suggestions-dropdown">
          <h3>Travel Suggestions</h3>

          {suggestions.length === 0 ? (
            <p>No travel suggestions.</p>
          ) : (
            suggestions.map((country) => (
              <div key={country.countryCode}>
                <span>{country.countryName}</span>
                <button onClick={() => handleAdd(country.countryCode)}>
                  Add to map
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}