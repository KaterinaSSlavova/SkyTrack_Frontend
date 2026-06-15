import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import {
  getTravelMap,
  markCountryAsVisited,
  removeVisitedCountry,
} from "../api/mapApi";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./TravelMapPage.css";

const geoUrl =
  "https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson";

export default function TravelMapPage() {
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [suggestedCountries, setSuggestedCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadMap() {
    try {
      setLoading(true);
      const data = await getTravelMap();
      setVisitedCountries(data.visitedCountries || []);
      setSuggestedCountries(data.suggestedCountries || []);
    } catch (err) {
      console.error("Failed to load travel map:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMap();
  }, []);

  const visitedCodes = useMemo(
    () => new Set(visitedCountries.map((c) => c.countryCode?.toUpperCase())),
    [visitedCountries]
  );

  const suggestedCodes = useMemo(
    () => new Set(suggestedCountries.map((c) => c.countryCode?.toUpperCase())),
    [suggestedCountries]
  );

 async function handleCountryClick(geo) {
   const countryCode = geo.properties["ISO3166-1-Alpha-2"];

   if (!countryCode || countryCode === "-99") return;

   try {
     if (visitedCodes.has(countryCode)) {
       await removeVisitedCountry(countryCode);
     } else {
       await markCountryAsVisited(countryCode);
     }

     await loadMap();
   } catch (err) {
     console.error("Country action failed:", err);
   }
 }

  return (
    <div className="travel-layout">
      <Sidebar />

      <main className="travel-main">
        <Topbar />

        <div className="travel-map-page">
          <div className="travel-map-header">
            <h1>Travel Map</h1>
          </div>

          {loading ? (
            <p className="travel-map-loading">Loading travel map...</p>
          ) : (
            <>
              <div className="travel-map-card">
                <ComposableMap projectionConfig={{ scale: 145 }}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryCode =
                          geo.properties["ISO3166-1-Alpha-2"];

                        const isVisited = visitedCodes.has(countryCode);
                        const isSuggested = suggestedCodes.has(countryCode);

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => handleCountryClick(geo)}
                            className={
                              isVisited
                                ? "country visited"
                                : isSuggested
                                ? "country suggested"
                                : "country"
                            }
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>

              <div className="travel-map-legend">
                <span>
                  <b className="legend-box visited-box"></b> Visited
                </span>
                <span>
                  <b className="legend-box suggested-box"></b> Suggested
                </span>
                <span>
                  <b className="legend-box default-box"></b> Not visited
                </span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}