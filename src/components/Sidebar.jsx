import { Link, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login");
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