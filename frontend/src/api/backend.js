import axios from 'axios';
import { supabase } from '../supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add Auth Token to requests
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export const createComplaint = (data) => api.post('/complaints', data);
export const getComplaints = () => api.get('/complaints');
export const getComplaintById = (id) => api.get(`/complaints/${id}`);
export const updateComplaint = (id, data) => api.patch(`/complaints/${id}`, data);
export const updateComplaintStatus = (id, data) => api.patch(`/complaints/${id}`, data);
