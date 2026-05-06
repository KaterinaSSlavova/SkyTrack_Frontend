import api from "./apiClient";

const url = "/seats";

export async function getSeat(seatId, flightId){
   const response = await api.get(`${url}/${seatId}/flight/${flightId}`);
   return response.data;
}

export async function getSeatMap(flightId){
   const response = await api.get(`${url}/${flightId}`);
   return response.data;
}