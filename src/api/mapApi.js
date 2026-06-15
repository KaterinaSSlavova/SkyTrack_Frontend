import api from "./apiClient";

const url = "/map";

export async function getTravelMap() {
   const response = await api.get(url);
   return response.data;
}

export async function getTravelSuggestions() {
   const response = await api.get(`${url}/suggestions`);
   return response.data;
}

export async function markCountryAsVisited(countryCode) {
   await api.post(`${url}/${countryCode}`);
}

export async function removeVisitedCountry(countryCode) {
   await api.delete(`${url}/${countryCode}`);
}