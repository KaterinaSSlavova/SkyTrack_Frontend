import api from "./apiClient";

const url = "/passengers";

export async function validatePassenger(passenger) {
    await api.post(`${url}/validate`, passenger);
}