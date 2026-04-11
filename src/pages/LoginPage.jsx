import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import "./LoginPage.css";

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">  <Plane size={28} style={{marginRight:"8px"}}/> Welcome back</h1>
                    <p className="login-subtitle">
                        Log in to plan your next trip with Sky Track.
                    </p>
                </div>

                <LoginForm />

                 <p className="login-register-link">
                                    Don't have an account? <Link to="/auth/register">Create one</Link>
                 </p>
            </div>
        </div>
    );
}