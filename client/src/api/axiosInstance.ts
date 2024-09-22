import axios from 'axios';
import { useRefreshTokenMutation } from '@/shared/http';

const API_URL: string = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      const { token, exp } = JSON.parse(tokenData);
      const currentTime = Date.now() / 1000;

      if (exp <= currentTime) {
        const refreshTokenMutation = useRefreshTokenMutation();
        try {
          refreshTokenMutation.mutateAsync();
          const newTokenData = localStorage.getItem('token');
          if (newTokenData) {
            const { newToken } = JSON.parse(tokenData);
            config.headers['Authorization'] = `Bearer ${newToken}`;
          }
        } catch (error) {
          console.error('Ошибка обновления токена:', error);
        }
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
