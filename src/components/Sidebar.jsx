import { Link, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import { logout } from "../api/authApi";
import { useUser } from "../context/UserContext";
import "./Sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const user = JSON.parse(localStorage.getItem("user"));

    async function handleLogout() {
           try {
               await logout();
           } catch (error) {
               console.error("Logout failed:", error);
           } finally {
               localStorage.removeItem("user");
               setUser(null);
               navigate("/auth/login");
           }
       }

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <Plane size={16} style={{ marginRight: "8px" }} />
                SkyTrack
            </div>

            <div className="sidebar-menu">

                {user?.role === "ADMIN" && (
                    <>
                        <Link to="/airports" className="sidebar-item">
                            Airports
                        </Link>

                        <Link to="/flights" className="sidebar-item">
                            Flights
                        </Link>

                    </>
                )}

                {user?.role === "PASSENGER" && (
                    <>
                        <Link to="/passenger" className="sidebar-item">
                            Dashboard
                        </Link>

                        <Link to="/flights/search" className="sidebar-item">
                            Search Flights
                        </Link>

                        <Link to="/bookings" className="sidebar-item">
                            Bookings
                        </Link>

                        <Link to="/travel-map" className="sidebar-item">
                            Travel Map
                        </Link>
                    </>
                )}

            </div>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </div>
    );
}