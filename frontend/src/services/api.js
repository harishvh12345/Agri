import axios from 'axios';

const API_BASE_URL = '/api'; // Proxied by Vercel or Vite in dev

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData),
};

export const harvestService = {
    predictCost: (data) => api.post('/predict-cost', data),
    createRequest: (data) => api.post('/harvest', data),
    getRequests: () => api.get('/harvest'),
    completeHarvest: (jobId) => api.post(`/harvest/complete/${jobId}`),
};

export const jobService = {
    getAvailableJobs: (role) => api.get(`/jobs?role=${role}`),
    acceptLabourJob: (jobId, userData) => api.post(`/jobs/accept/${jobId}`, userData),
    acceptTransportJob: (jobId, userData) => api.post(`/transport/accept/${jobId}`, userData),
};

export default api;
