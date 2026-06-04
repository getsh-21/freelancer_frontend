import axios from 'axios';
const BASE = `${import.meta.env.VITE_API_URL}/api/jobs`;

export const getJobsApi = (params) => axios.get(BASE, { params });
export const getJobByIdApi = (id) => axios.get(`${BASE}/${id}`);
export const createJobApi = (data) => axios.post(BASE, data);
export const updateJobApi = (id, data) => axios.put(`${BASE}/${id}`, data);
export const deleteJobApi = (id) => axios.delete(`${BASE}/${id}`);
export const getMyJobsApi = () => axios.get(`${BASE}/my`);