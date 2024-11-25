import axios, { AxiosResponse } from 'axios';

// Crear instancia de Axios con configuración predeterminada
export const AxiosInstance = axios.create({
  //baseURL: 'https://fastapi.fichafamiliarchambo.site/', // Reemplaza con la URL base de tu API
  baseURL: 'http://localhost:8000/', // Reemplaza con la URL base de tu API
  timeout: 5000, // Tiempo de espera para las solicitudes
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getfetcher = async <T>(url: string): Promise<T> => {
  const response: AxiosResponse<T> = await AxiosInstance.get(url);
  return response.data;
};