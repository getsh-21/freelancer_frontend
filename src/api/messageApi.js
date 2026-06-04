import axios from 'axios';
const BASE = `${import.meta.env.VITE_API_URL}/api/messages`;

export const sendMessageApi = (data) => axios.post(BASE, data);
export const getMessagesApi = (userId) => axios.get(`${BASE}/${userId}`);
export const getChatPartnersApi = () => axios.get(`${BASE}/partners`);