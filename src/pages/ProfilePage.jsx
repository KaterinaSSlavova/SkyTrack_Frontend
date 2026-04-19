import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { getLoggedUser, updateUser, deleteUserAccount} from "../api/userApi";
import "./ProfilePage.css";

export default function ProfilePage() {
    const navigate = useNavigate();
    const dateRef = useRef(null);

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        picture: "",
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
    });

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getLoggedUser();
                setUser(data);

                setFormData({
                    picture: data.picture || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    birthDate: "",
                });
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleImageUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                picture: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    }

    async function handleSave() {
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            picture: formData.picture,
        };

        if (formData.birthDate) {
            payload.birthDate = formData.birthDate;
        }

        const updatedUser = await updateUser(payload);

        setUser(updatedUser);
        setFormData({
            picture: updatedUser.picture || "",
            firstName: updatedUser.firstName || "",
            lastName: updatedUser.lastName || "",
            email: updatedUser.email || "",
            birthDate: "",
        });

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!confirmed) return;

        await deleteUserAccount();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login");
    }

    function handleCancel() {
        if (!user) return;

        setFormData({
            picture: user.picture || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            birthDate: "",
        });

        setIsEditing(false);
    }

    function formatDate(date) {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString();
    }

    function openDatePicker() {
        if (dateRef.current?.showPicker) {
            dateRef.current.showPicker();
        }
    }

    if (loading) {
        return (
            <div className="profile-page">
                <Sidebar />
                <div className="profile-content">
                    <div className="profile-card">
                        <p className="profile-text">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Sidebar />

            <div className="profile-content">
                <Topbar
                    user={user}
                    onProfileClick={() => navigate("/profile")}
                />

                <div className="profile-card">
                    <h1 className="profile-title">My Profile</h1>

                    <div className="profile-avatar-section">
                        {formData.picture ? (
                            <img
                                src={formData.picture}
                                alt="Profile"
                                className="profile-avatar-img"
                            />
                        ) : (
                            <div className="profile-avatar-initials">
                                {formData.firstName?.[0] || "U"}
                                {formData.lastName?.[0] || ""}
                            </div>
                        )}

                        {isEditing && (
                            <div className="profile-upload-section">
                                <label
                                    htmlFor="profile-picture-upload"
                                    className="profile-upload-btn"
                                >
                                    Upload New Photo
                                </label>
                                <input
                                    id="profile-picture-upload"
                                    className="profile-file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        )}
                    </div>

                    <div className="profile-info">
                        <div className="profile-field">
                            <label className="profile-label">First Name</label>
                            {isEditing ? (
                                <input
                                    className="profile-input"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="profile-text">
                                    {user?.firstName || "-"}
                                </p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Last Name</label>
                            {isEditing ? (
                                <input
                                    className="profile-input"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="profile-text">
                                    {user?.lastName || "-"}
                                </p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Email</label>
                            {isEditing ? (
                                <input
                                    className="profile-input"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="profile-text">
                                    {user?.email || "-"}
                                </p>
                            )}
                        </div>

                        <div className="profile-field">
                            <label className="profile-label">Birth Date</label>
                            {isEditing ? (
                                <input
                                    ref={dateRef}
                                    className="profile-input"
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    onClick={openDatePicker}
                                    onFocus={openDatePicker}
                                />
                            ) : (
                                <p className="profile-text">
                                    {formatDate(user?.birthDate)}
                                </p>
                            )}
                        </div>

                        {!isEditing && (
                            <>
                                <div className="profile-field">
                                    <label className="profile-label">Age</label>
                                    <p className="profile-text">
                                        {user?.age ?? "Not set"}
                                    </p>
                                </div>

                                <div className="profile-field">
                                    <label className="profile-label">Role</label>
                                    <p className="profile-text">
                                        {user?.role || "-"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <>
                                <button
                                    type="button"
                                    className="profile-edit-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="profile-delete-btn"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="profile-save-btn"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}