import axios from "axios";

const api = axios.create({baseURL: import.meta.env.VITE_API_BASE_URL, withCredentials: true});

api.interceptors.request.use((config) => {
    const csrfToken = document.cookie
        .split(';')
        .find(c => c.trim().startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        const isPublicVerifyBooking =
                    originalRequest?.url?.includes("bookings/verify");

        if (isPublicVerifyBooking) {
                return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.startsWith("/auth/")
        ) {
            originalRequest._retry = true;

            try {
                await api.post("/auth/refresh");

                window.dispatchEvent(new Event("auth-refreshed"));

                return api(originalRequest);
            }
            catch {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;