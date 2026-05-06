import { Bell } from "lucide-react";
import { useUser } from "../context/UserContext";
import "./Topbar.css";

export default function Topbar({ onProfileClick }) {
    const { user, loadingUser } = useUser();

    if (loadingUser) return null;

    return (
        <div className="passenger-topbar">
            <button className="notification-btn" type="button">
                <Bell size={20} />
            </button>

            <div
                className="profile-avatar"
                onClick={onProfileClick}
                style={{ cursor: "pointer" }}
            >
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
    );
}