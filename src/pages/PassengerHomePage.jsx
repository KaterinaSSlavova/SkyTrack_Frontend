import "./PassengerHomePage.css";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Bell } from "lucide-react";
import { getLoggedUser } from "../api/userApi";

export default function PassengerHomePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getLoggedUser();
                setUser(data);
            } catch (error) {
                console.error("Failed to load user:", error);
            }
        }

        loadUser();
    }, []);

    return (
        <div className="passenger-page">
            <Sidebar />

            <div className="passenger-content">
                <div className="passenger-topbar">
                    <button className="notification-btn" type="button">
                        <Bell size={20} />
                    </button>

                    <div className="profile-avatar">
                        {user?.picture ? (
                            <img
                                src={user.picture}
                                alt="Profile"
                                className="profile-image"
                            />
                        ) : (
                            <span>
                                {user?.firstName?.[0] || "U"}
                                {user?.lastName?.[0] || ""}
                            </span>
                        )}
                    </div>
                </div>

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