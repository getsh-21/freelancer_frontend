import axios from 'axios';
const BASE = `${import.meta.env.VITE_API_URL}/api/proposals`;

export const submitProposalApi = (data) => axios.post(BASE, data);
export const getJobProposalsApi = (jobId) => axios.get(`${BASE}/job/${jobId}`);
export const updateProposalApi = (id, data) => axios.put(`${BASE}/${id}`, data);
export const getMyProposalsApi = () => axios.get(`${BASE}/my`);