import { REMOTE } from '@/config';
import axios, { AxiosError, AxiosResponse } from 'axios';
const token = localStorage.getItem('token')

// Crear instancia de Axios con configuración predeterminada
export const AxiosInstance = axios.create({
  //baseURL: 'https://fastapi.fichafamiliarchambo.site/', // Reemplaza con la URL base de tu API
  baseURL: REMOTE, // Reemplaza con la URL base de tu API
  //timeout: 5000, // Tiempo de espera para las solicitudes
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Obtén el token actualizado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

AxiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error: AxiosError) => {
    // Si el error es 401 (No autorizado), redirigimos al login
    if (error.response?.status === 401) {
      // Elimina el token del localStorage
      localStorage.removeItem('token');
      // Redirige al usuario a la página de login

    }

    // Retorna el error para que pueda ser manejado por el código que hizo la solicitud
    return Promise.reject(error);
  }
);

export const getfetcher = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await AxiosInstance.get(url);
  return response.data;
};

