import axios from 'axios';

// Instancia de axios apuntando a nuestra API
// Es como configurar el base URL una sola vez para no repetirlo en cada petición
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor — se ejecuta antes de cada petición
// Agrega el token JWT automáticamente en el header Authorization
// Es como el middleware del backend pero en el frontend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;