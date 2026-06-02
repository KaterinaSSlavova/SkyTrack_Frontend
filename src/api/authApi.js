import api from "./apiClient";

const url = "/auth";

export async function login(data){
   await api.get(`${url}/csrf`);
   const response = await api.post(`${url}/login`, data);
   return response.data;
}

export async function register(data){
    await api.get(`${url}/csrf`);
    const response = await api.post(`${url}/register`, data);
    return response.data;
}

export async function logout() {
    await api.post(`${url}/logout`);
}