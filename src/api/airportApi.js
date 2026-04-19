import api from "./apiClient";

const url = "/airports";

export async function getAllAirports(){
   const response = await api.get(url);
   return response.data;
}

export async function getAirportById(id){
   const response = await api.get(`${url}/${id}`);
   return response.data;
}

export async function createAirport(data){
   const response = await api.post(url,data);
   return response.data;
}

export async function updateAirport(id,data){
   await api.put(`${url}/${id}`, data);
}

export async function archiveAirport(id){
   await api.patch(`${url}/${id}`);
}

export async function searchAirports(input){
   const response = await api.get(`${url}/search`, {params: {input}});
   return response.data;
}