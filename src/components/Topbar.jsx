import { Bell } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useEffect, useRef, useState } from "react";
import { getAllNotifications, markNotificationAsRead,markAllNotificationsAsRead} from "../api/notificationApi";
import {getNotification,disconnectNotificationSocket} from "../api/notificationSocket";
import "./Topbar.css";

export default function Topbar({ onProfileClick }) {
    const { user, loadingUser } = useUser();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);

    async function loadNotifications() {
        try {
            const data = await getAllNotifications();
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadNotifications();

        getNotification((notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return () => disconnectNotificationSocket();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleMarkRead(id) {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function handleMarkAllRead() {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    if (loadingUser) return null;

    return (
        <div className="passenger-topbar">
            <div className="notification-wrapper" ref={dropdownRef}>
                <button
                    className="notification-btn"
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>

                {open && (
                    <div className="notification-dropdown">
                        <div className="notification-dropdown-header">
                            <span className="notification-dropdown-title">Notifications</span>
                            {unreadCount > 0 && (
                                <button
                                    className="mark-all-btn"
                                    onClick={handleMarkAllRead}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <p className="notification-empty">No notifications yet.</p>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`notification-item ${n.read ? "" : "unread"}`}
                                        onClick={() => !n.read && handleMarkRead(n.id)}
                                    >
                                        {!n.read && <span className="unread-dot" />}
                                        <div className="notification-body">
                                            {n.title && (
                                                <p className="notification-title">{n.title}</p>
                                            )}
                                            <p className="notification-message">{n.message}</p>
                                            {n.createdAt && (
                                                <p className="notification-time">
                                                    {new Date(n.createdAt).toLocaleString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div
                className="profile-avatar"
                onClick={onProfileClick}
                style={{ cursor: "pointer" }}
            >
                {user?.picture ? (
                    <img src={user.picture} alt="Profile" className="profile-image" />
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