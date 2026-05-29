import api from "./apiClient";

const url = "/passengers";

export async function validatePassenger(passenger, departureDate) {
    const formatted = new Date(departureDate).toISOString().split("T")[0];

    await api.post(`${url}/validate`, passenger, {
        params: { departureDate: formatted }
    });
}