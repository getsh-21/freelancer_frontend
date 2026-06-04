import axios from 'axios';
const BASE = `${import.meta.env.VITE_API_URL}/api/auth`;

export const registerApi = (data) => axios.post(`${BASE}/register`, data);
export const loginApi = (data) => axios.post(`${BASE}/login`, data);
export const getProfileApi = () => axios.get(`${BASE}/profile`);