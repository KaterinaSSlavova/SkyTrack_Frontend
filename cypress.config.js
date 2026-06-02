import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
        defaultCommandTimeout: 10000,
        env: {
            apiUrl: process.env.VITE_API_BASE_URL || "http://localhost:8080",
        }
    },
});