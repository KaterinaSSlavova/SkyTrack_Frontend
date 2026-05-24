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

//api.interceptors.response.use(
//    (response) => response,
//
//    async (error) => {
//        const originalRequest = error.config;
//
//        if (
//            error.response?.status === 401 &&
//            !originalRequest._retry &&
//            !originalRequest.url.includes("/auth/refresh")
//        ) {
//            originalRequest._retry = true;
//
//            try {
//                await api.post("/auth/refresh");
//
//                return api(originalRequest);
//            }
//            catch {
//                window.location.href = "/login";
//            }
//        }
//
//        return Promise.reject(error);
//    }
//);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        console.log("Interceptor caught:", error.response?.status, originalRequest?.url);

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.startsWith("/auth/")
        ) {
            originalRequest._retry = true;

            try {
                console.log("Calling refresh endpoint...");
                await api.post("/auth/refresh");

                window.dispatchEvent(new Event("auth-refreshed"));

                console.log("Retrying original request...");
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