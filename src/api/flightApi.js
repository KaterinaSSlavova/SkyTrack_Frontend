import api from "./apiClient";

const url = "/flights";

export async function searchFlights(departureIata, arrivalIata, departureDate){
   const response = await api.get(`${url}/duffel/search`,{params: {departureIata, arrivalIata, departureDate}});
   return response.data;
}

export async function saveDuffelFlight(flight){
   const response = await api.post(`${url}/duffel/save`, flight);
   return response.data
}

export async function getAllDuffelFlights() {
   const response = await api.get(`${url}/duffel`);
   return response.data;
}

export async function getDuffelFlightById(id) {
  const response = await api.get(`${url}/duffel/${id}`);
  return response.data;
}

export async function updateFlightGate(id, gate) {
  await api.patch(`${url}/duffel/${id}/gate`, null, {
    params: { gate },
  });
}

export async function updateFlightStatus(id, status, newDepTime = null) {
    await api.patch(`${url}/duffel/${id}/status`, null, {
        params: {
            status,
            ...(newDepTime ? { newDepTime } : {}),
        },
    });
}