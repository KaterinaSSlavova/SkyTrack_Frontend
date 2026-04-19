import RegistrationForm from "../components/RegistrationForm";
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";
import "./RegistrationPage.css";

export default function RegistrationPage() {
    return (
        <div className="registration-page">
            <div className="registration-card">
                <div className="registration-header">
                    <h1 className="registration-title"> <Plane size={28} style={{marginRight:"8px"}}/> Create your account</h1>
                </div>

                <RegistrationForm />
                <p className="registration-login-link">
                                    Already have an account? <Link to="/auth/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}