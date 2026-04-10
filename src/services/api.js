import axios from 'axios';

const api = axios.create({
  baseURL: 'https://finance-tracker-api-production-5229.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;