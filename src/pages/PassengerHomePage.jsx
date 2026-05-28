import { useEffect, useState } from "react";
import "./PassengerHomePage.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getBookingStats, getNextFlight, getQRCode } from "../api/bookingApi";
import BookingCard from "../components/BookingCard";

export default function PassengerHomePage() {
    const { user, loadingUser } = useUser();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [nextFlight, setNextFlight] = useState(null);
    const [qrCodes, setQrCodes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getBookingStats(),
            getNextFlight().catch(() => null)
        ])
            .then(([statsData, flightData]) => {
                setStats(statsData);
                setNextFlight(flightData);
                if (flightData?.bookingReference) {
                    getQRCode(flightData.bookingReference)
                        .then(url => setQrCodes({ [flightData.bookingReference]: url }));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const refreshDashboard = () => {
        getNextFlight().catch(() => null).then(flightData => {
            setNextFlight(flightData);
            if (flightData?.bookingReference) {
                getQRCode(flightData.bookingReference)
                    .then(url => setQrCodes({ [flightData.bookingReference]: url }));
            }
        });
        getBookingStats().then(setStats);
    };

    if (loadingUser || loading) return <p>Loading...</p>;

    return (
        <div className="passenger-page">
            <Sidebar />
            <div className="passenger-content">
                <Topbar onProfileClick={() => navigate("/profile")} />

                <h2 className="dashboard-greeting">
                    Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
                </h2>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <p className="stat-label">Total Flights</p>
                        <p className="stat-value">{stats?.totalFlights ?? 0}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Total Spent</p>
                        <p className="stat-value">€{stats?.totalSpent ?? "0.00"}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Destinations</p>
                        <p className="stat-value">{stats?.uniqueDestinations ?? 0}</p>
                    </div>
                    <div className="stat-card">
                        <p className="stat-label">Upcoming</p>
                        <p className="stat-value">{stats?.upcomingFlights ?? 0}</p>
                    </div>
                </div>

                <h3 className="section-title">Next Flight</h3>
                {nextFlight ? (
                    <div className="next-flight-wrapper">
                        <BookingCard
                            booking={nextFlight}
                            qrCodes={qrCodes}
                            highlight={true}
                            onCancelled={refreshDashboard}
                            expandable={false}
                        />
                    </div>
                ) : (
                    <div className="no-flights-card">
                        <p>No upcoming flights yet.</p>
                        <button
                            className="search-flights-btn"
                            onClick={() => navigate("/search")}
                        >
                            Search Flights
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}