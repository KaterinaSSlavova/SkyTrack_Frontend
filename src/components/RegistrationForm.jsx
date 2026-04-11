import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { supabase } from "../api/supabaseClient";
import { useFormErrors } from "../components/useFormErrors";
import "./RegistrationForm.css";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        picture: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password: ""
    });

    const {generalError,fieldErrors,clearErrors,clearFieldError,handleApiError} = useFormErrors();

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        clearFieldError(name);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            clearErrors();
            await register(formData);
            navigate("/auth/login");
        } catch (error) {
            handleApiError(error);
            console.error(error);
        }
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        const { error } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (error) {
            console.error(error);
            handleApiError({
                response: {
                    data: {
                        message: "Image upload failed",
                        fieldErrors: {}
                    }
                }
            });
            return;
        }

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        setFormData(prev => ({
            ...prev,
            picture: data.publicUrl
        }));
    }

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            {generalError && (
                <p className="registration-error">{generalError}</p>
            )}

            <div className="registration-row">
                <div className="registration-field registration-avatar-field">
                    <label htmlFor="avatarUpload">Profile Picture</label>

                    <input
                        key={formData.picture}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden-file-input"
                        id="avatarUpload"
                    />

                    <label htmlFor="avatarUpload" className="avatar-upload">
                        {formData.picture ? (
                            <img
                                src={formData.picture}
                                alt="Profile"
                                className="avatar-preview"
                            />
                        ) : (
                            <div className="avatar-placeholder">Upload Photo</div>
                        )}
                    </label>
                </div>

                <div className="registration-field">
                    <label>First Name</label>
                    <input
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={fieldErrors.firstName ? "registration-input-error" : ""}
                    />
                    {fieldErrors.firstName && (
                        <p className="registration-field-error">{fieldErrors.firstName}</p>
                    )}
                </div>
            </div>

            <div className="registration-row">
                <div className="registration-field">
                    <label>Last Name</label>
                    <input
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={fieldErrors.lastName ? "registration-input-error" : ""}
                    />
                    {fieldErrors.lastName && (
                        <p className="registration-field-error">{fieldErrors.lastName}</p>
                    )}
                </div>

                <div className="registration-field">
                    <label>Birthdate</label>
                    <input
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={fieldErrors.birthDate ? "registration-input-error" : ""}
                    />
                    {fieldErrors.birthDate && (
                        <p className="registration-field-error">{fieldErrors.birthDate}</p>
                    )}
                </div>
            </div>

            <div className="registration-row">
                <div className="registration-field">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        className={fieldErrors.email ? "registration-input-error" : ""}
                    />
                    {fieldErrors.email && (
                        <p className="registration-field-error">{fieldErrors.email}</p>
                    )}
                </div>

                <div className="registration-field">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        className={fieldErrors.password ? "registration-input-error" : ""}
                    />
                    {fieldErrors.password && (
                        <p className="registration-field-error">{fieldErrors.password}</p>
                    )}
                </div>
            </div>

            <button className="registration-button" type="submit">
                Register
            </button>
        </form>
    );
}