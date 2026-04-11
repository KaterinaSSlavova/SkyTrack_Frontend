import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAirports, archiveAirport } from "../api/airportApi";
import Sidebar from "../components/Sidebar";
import "./AirportOverviewPage.css";

function AirportOverviewPage() {
  const [airports, setAirports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {loadAirports();}, []);

  async function loadAirports() {
    const data = await getAllAirports();
    setAirports(data.airports);
  }

  async function handleArchive(id) {
    const confirmed = window.confirm("Are you sure you want to archive this airport?");
    if (!confirmed) return;

    await archiveAirport(id);
    await loadAirports();
  }

  return (
    <div className="airport-page">
      <Sidebar />

      <div className="airport-content">
        <div className="airport-card">
          <div className="airport-header">
            <div>
              <h1 className="airport-title">Airport Overview</h1>
            </div>

            <button className="airport-create-button"
              onClick={() => navigate("/airports/create")}>
              Create New Airport
            </button>
          </div>

          <div className="airport-table-wrapper">
            <table className="airport-table">
              <thead>
                <tr>
                  <th>IATA</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Timezone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {airports.length > 0 ? (
                  airports.map((airport) => (
                    <tr key={airport.id}>
                      <td>{airport.iataCode}</td>
                      <td>{airport.name}</td>
                      <td>{airport.city}</td>
                      <td>{airport.country}</td>
                      <td>{airport.timezone}</td>
                      <td>
                        <div className="airport-actions">
                          <button
                            className="airport-update-button"
                            onClick={() => navigate(`/airports/update/${airport.id}`)}
                          >
                            Update
                          </button>

                          <button
                            className="airport-archive-button"
                            onClick={() => handleArchive(airport.id)}
                          >
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="airport-empty">
                      No airports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirportOverviewPage;