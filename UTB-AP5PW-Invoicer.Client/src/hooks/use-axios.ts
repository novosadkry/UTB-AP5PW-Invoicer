import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuth } from '@/hooks/use-auth';

export function useAxiosPublic() {
  return axios.create({
    baseURL: '/api/client',
    headers: { 'Content-Type': 'application/json' }
  });
}

export function useAxiosPrivate() {
  const { accessToken, setAccessToken } = useAuth();

  const axiosPrivate = axios.create({
    baseURL: '/api/client',
    headers: { 'Content-Type': 'application/json' }
  });

  axiosPrivate.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (originalRequest._retry)
        return Promise.reject(error);

      if (error.response?.status === 401) {
        originalRequest._retry = true;

        try {
          const axiosRefresh = axios.create({
            baseURL: '/api',
            withCredentials: true,
          });

          const refreshResponse = await axiosRefresh.post('/auth/refresh');
          const newAccessToken = refreshResponse.data.accessToken;

          setAccessToken(newAccessToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return axiosPrivate(originalRequest);
        } catch (refreshError) {
          setAccessToken(null);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosPrivate;
}

export function useAxiosAdmin() {
  const { accessToken, setAccessToken } = useAuth();

  const axiosAdmin = axios.create({
    baseURL: '/api/admin',
    headers: { 'Content-Type': 'application/json' }
  });

  axiosAdmin.interceptors.request.use(
    (config) => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosAdmin.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (originalRequest._retry)
        return Promise.reject(error);

      if (error.response?.status === 401) {
        originalRequest._retry = true;

        try {
          const axiosRefresh = axios.create({
            baseURL: '/api',
            withCredentials: true,
          });

          const refreshResponse = await axiosRefresh.post('/auth/refresh');
          const newAccessToken = refreshResponse.data.accessToken;

          setAccessToken(newAccessToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return axiosAdmin(originalRequest);
        } catch (refreshError) {
          setAccessToken(null);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosAdmin;
}
