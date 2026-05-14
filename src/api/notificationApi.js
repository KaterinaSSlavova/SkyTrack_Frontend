import api from "./apiClient";

const url = "/notifications";

export async function getAllNotifications() {
  const response = await api.get(url);
  return response.data;
}

export async function getUnreadNotifications() {
  const response = await api.get(`${url}/unread`);
  return response.data;
}

export async function getNotificationById(id) {
  const response = await api.get(`${url}/${id}`);
  return response.data;
}

export async function markNotificationAsRead(id) {
  await api.patch(`${url}/${id}/read`);
}

export async function markAllNotificationsAsRead() {
  await api.patch(`${url}/read-all`);
}