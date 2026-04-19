import { useState } from "react";
import { errorApi } from "../api/errorApi";

export function useFormErrors() {
    const [generalError, setGeneralError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    function clearErrors() {
        setGeneralError("");
        setFieldErrors({});
    }

    function clearFieldError(fieldName) {
        setFieldErrors((prev) => ({
            ...prev,
            [fieldName]: ""
        }));
    }

    function handleApiError(error) {
        const apiError = errorApi(error);
        setGeneralError(apiError.message);
        setFieldErrors(apiError.fieldErrors);
    }

    return {
        generalError,
        fieldErrors,
        clearErrors,
        clearFieldError,
        handleApiError
    };
}