import api from "./apiClient";

const url = "/users";

export async function getLoggedUser(){
   const response = await api.get(`${url}/me`);
   return response.data;
}