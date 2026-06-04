import axios from 'axios';
const BASE = `${import.meta.env.VITE_API_URL}/api/notifications`;

export const getNotificationsApi = () => axios.get(BASE);
export const markAsReadApi = (id) => axios.put(`${BASE}/${id}`);
export const markAllAsReadApi = () => axios.put(`${BASE}/read-all`);