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

export default api;