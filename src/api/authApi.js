import api from "./apiClient";

const url = "/auth";

export async function login(data){
   const response = await api.post(`${url}/login`, data);
   return response.data;
}

export async function register(data){
    const response = await api.post(`${url}/register`, data);
    return response.data;
}