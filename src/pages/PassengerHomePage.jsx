import "./PassengerHomePage.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function PassengerHomePage() {
    const { user, loadingUser } = useUser();
    const navigate = useNavigate();

    if (loadingUser) {
        return <p>Loading...</p>;
    }

    return (
        <div className="passenger-page">
            <Sidebar />
            <div className="passenger-content">
                <Topbar onProfileClick={() => navigate("/profile")} />

                <div className="passenger-card">
                    <h1 className="passenger-title">
                        Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
                    </h1>

                    <p className="passenger-text">
                        You are logged in as a passenger.
                    </p>

                    <p className="passenger-text">
                        Your travel dashboard will appear here soon.
                    </p>
                </div>
            </div>
        </div>
    );
}