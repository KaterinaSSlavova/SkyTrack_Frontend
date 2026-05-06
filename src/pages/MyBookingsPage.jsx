import { useEffect, useState } from "react";
import { getAllBookings, getQRCode } from "../api/bookingApi";
import Sidebar from '../components/Sidebar';
import BookingCard from '../components/BookingCard';
import "./MyBookingsPage.css";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

export default function MyBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [qrCodes, setQrCodes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await getAllBookings();
            setBookings(data);
            const qrs = {};
            await Promise.all(data.map(async (booking) => {
                try {
                    qrs[booking.bookingReference] = await getQRCode(booking.bookingReference);
                } catch {
                    qrs[booking.bookingReference] = null;
                }
            }));
            setQrCodes(qrs);
        } catch {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const now = new Date();

    const upcomingBookings = bookings
        .filter(b => b.status === "ACTIVE" && new Date(b.flight?.departureLocalTime) >= now)
        .sort((a, b) => new Date(a.flight?.departureLocalTime) - new Date(b.flight?.departureLocalTime));

    const pastBookings = bookings
        .filter(b => b.status === "COMPLETED")
        .sort((a, b) => new Date(b.flight?.departureLocalTime) - new Date(a.flight?.departureLocalTime));

    const cancelledBookings = bookings
        .filter(b => b.status === "CANCELLED")
        .sort((a, b) => new Date(b.flight?.departureLocalTime) - new Date(a.flight?.departureLocalTime));

    const nextBooking = upcomingBookings[0];
    const remainingUpcoming = upcomingBookings.slice(1);
    const tabBookings = activeTab === "upcoming" ? remainingUpcoming
        : activeTab === "past" ? pastBookings
        : cancelledBookings;

    return (
        <div className="bookings-page">
            <Sidebar />
            <div className="bookings-content">
                <Topbar onProfileClick={() => navigate("/profile")} />

                <h2 className="bookings-title">My Bookings</h2>

                {loading && <p className="bookings-loading">Loading...</p>}
                {error && <p className="bookings-error">{error}</p>}

                {!loading && !error && bookings.length === 0 && (
                    <div className="bookings-empty">No bookings found.</div>
                )}

                {nextBooking && (
                    <BookingCard booking={nextBooking} qrCodes={qrCodes} highlight={true} onCancelled={fetchBookings} />
                )}

                {!loading && !error && bookings.length > 0 && (
                    <>
                        <div className="bookings-tabs">
                            <button
                                className={`bookings-tab ${activeTab === "upcoming" ? "active" : ""}`}
                                onClick={() => setActiveTab("upcoming")}
                            >
                                Upcoming
                                {remainingUpcoming.length > 0 && (
                                    <span className="tab-badge">{remainingUpcoming.length}</span>
                                )}
                            </button>
                            <button
                                className={`bookings-tab ${activeTab === "past" ? "active" : ""}`}
                                onClick={() => setActiveTab("past")}
                            >
                                Past
                                {pastBookings.length > 0 && (
                                    <span className="tab-badge">{pastBookings.length}</span>
                                )}
                            </button>
                            <button
                                className={`bookings-tab ${activeTab === "cancelled" ? "active" : ""}`}
                                onClick={() => setActiveTab("cancelled")}
                            >
                                Cancelled
                                {cancelledBookings.length > 0 && (
                                    <span className="tab-badge tab-badge-cancelled">{cancelledBookings.length}</span>
                                )}
                            </button>
                        </div>

                        {tabBookings.length === 0 ? (
                            <div className="bookings-empty">
                                {activeTab === "upcoming" ? "No upcoming bookings." : "No bookings here."}
                            </div>
                        ) : (
                            tabBookings.map(booking => (
                                <BookingCard key={booking.id} booking={booking} qrCodes={qrCodes} highlight={false} onCancelled={fetchBookings} />
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}