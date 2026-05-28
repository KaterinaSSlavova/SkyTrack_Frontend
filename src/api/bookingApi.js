import api from "./apiClient";

const url = "bookings";

export async function getAllBookings(){
   const response = await api.get(url);
   return response.data;
}

export async function getBooking(id){
   const response = await api.get(`${url}/${id}`);
   return response.data;
}

export async function createBooking(data){
   const response = await api.post(url,data);
   return response.data;
}

export async function cancelBooking(id){
   await api.patch(`${url}/${id}/cancel`);
}

export async function getQRCode(reference){
   const response = await api.get(`${url}/${reference}/qr`,{responseType: "blob"});
   return URL.createObjectURL(response.data);
}

export async function verifyBooking(reference) {
   const response = await api.get(`${url}/verify/${reference}`);
   return response.data;
}

export async function getBookingStats() {
    const response = await api.get(`${url}/statistics`);
    return response.data;
}

export async function getNextFlight() {
    const response = await api.get(`${url}/upcoming`);
    return response.data;
}