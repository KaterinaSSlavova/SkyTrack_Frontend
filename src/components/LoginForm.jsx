import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useFormErrors } from "../components/useFormErrors";
import "./LoginForm.css";

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

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

            const response = await login(formData);

            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: response.id,
                    firstName: response.firstName,
                    role: response.role
                })
            );

            setFormData({
                email: "",
                password: ""
            });

            if (response.role === "ADMIN") {
                navigate("/airports");
            } else {
                navigate("/passenger");
            }
        } catch (error) {
            handleApiError(error);
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            {generalError && <p className="login-error">{generalError}</p>}

            <div className="login-field">
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? "login-input-error" : ""}
                />
                {fieldErrors.email && (
                    <p className="login-field-error">{fieldErrors.email}</p>
                )}
            </div>

            <div className="login-field">
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    className={fieldErrors.password ? "login-input-error" : ""}
                />
                {fieldErrors.password && (
                    <p className="login-field-error">{fieldErrors.password}</p>
                )}
            </div>

            <button className="login-button" type="submit">
                Log In
            </button>
        </form>
    );
}