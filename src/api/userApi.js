import api from "./apiClient";

const url = "/users";

export async function getLoggedUser(){
   const response = await api.get(`${url}/me`);
   return response.data;
}

export async function updateUser(data){
   const response = await api.patch(`${url}/me`, data);
   return response.data
}

export async function deleteUserAccount(){
   await api.delete(`${url}/me`);
}