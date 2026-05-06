import api from "./apiClient";

const url = "/flights";

export async function getAllFlights(){
   const response = await api.get(url);
   return response.data;
}

export async function getFlightById(id){
  const response =await api.get(`${url}/${id}`);
  return response.data;
}

export async function createFlight(data){
   const response = await api.post(url,data);
   return response.data;
}

export async function updateFlight(id, data){
   await api.put(`${url}/${id}`, data);
}

export async function cancelFlight(id){
   await api.patch(`${url}/${id}/cancel`);
}

export async function searchFlights(departureIata, arrivalIata, departureDate){
   const response = await api.get(`${url}/duffel/search`,{params: {departureIata, arrivalIata, departureDate}});
   return response.data;
}

export async function saveDuffelFlight(flight){
   const response = await api.post(`${url}/duffel/save`, flight);
   return response.data
}