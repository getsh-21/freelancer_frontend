import axios from 'axios';
const BASE = `${import.meta.env.VITE_API_URL}/api/reviews`;

export const createReviewApi = (data) => axios.post(BASE, data);
export const getFreelancerReviewsApi = (id) => axios.get(`${BASE}/${id}`);