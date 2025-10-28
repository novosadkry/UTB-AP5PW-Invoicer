import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

const axiosPublic = axios.create({
  baseURL: '/api',
});

const axiosPrivate = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export function useAxiosPublic() {
  return axiosPublic;
}

export function useAxiosPrivate() {
  const { accessToken, setAccessToken } = useAuth();

  // A variable to hold the promise of the refresh token, to prevent race conditions
  let refreshPromise: Promise<unknown> | null = null;

  useEffect(() => {
    // --- Request Interceptor ---
    // This runs before every request using this axios instance
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // If the Authorization header isn't set, set it
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // --- Response Interceptor ---
    // This runs after a response is received
    const responseIntercept = axiosPrivate.interceptors.response.use(
      // If the response is successful, just return it
      (response) => response,

      // If there's an error, handle it
      async (error) => {
        const originalRequest = error.config;

        // Check if the error is a 401 (Unauthorized) and we haven't retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark that we've retried

          // Check if we are already refreshing the token
          if (!refreshPromise) {
            // If not, create the refresh promise
            refreshPromise = axiosPrivate.post('/auth/refresh')
              .then(response => {
                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken); // Update context

                // Update the Authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return newAccessToken;
              })
              .catch(err => {
                // If refresh fails, log out the user
                console.error("Token refresh failed:", err);
                setAccessToken(null); // Or call a full logout function
                return Promise.reject(err);
              })
              .finally(() => {
                refreshPromise = null; // Reset the promise
              });
          }

          // Wait for the refresh promise to resolve
          try {
            await refreshPromise;
            // Once the token is refreshed, retry the original request
            return axiosPrivate(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        // For any other errors, just reject the promise
        return Promise.reject(error);
      }
    );

    // Cleanup function: Eject the interceptors when the component unmounts
    // This prevents memory leaks
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken]); // Re-run if auth state changes

  return axiosPrivate;
}
