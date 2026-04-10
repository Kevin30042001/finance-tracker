import axios from 'axios';

// En producción (Vercel), VITE_API_URL debe estar configurada en las variables de entorno del proyecto
// En Vercel: Settings → Environment Variables → VITE_API_URL = https://finance-tracker-api-production-5229.up.railway.app/api
// En local: crear archivo .env con VITE_API_URL=http://localhost:3000/api
const API_URL = import.meta.env.VITE_API_URL || 'https://finance-tracker-api-production-5229.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor — adjunta el token JWT a cada petición automáticamente
// Es como el token de Firebase que se enviaba en cada llamada a la API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
