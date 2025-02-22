import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utility functions for handling tokens
const getTokenFromStorage = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error fetching token from AsyncStorage:', error);
    return null;
  }
};

const setTokenInStorage = async (key, value) => await AsyncStorage.setItem(key, value);

const removeTokens = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('refreshToken');
};

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://192.168.1.143:8000/api/',
});

// Attach token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getTokenFromStorage('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await getTokenFromStorage('refreshToken');
      if (!refreshToken) return Promise.reject(error);

      try {
        const response = await api.post('/token/refresh/', { refresh: refreshToken });
        const { access } = response.data;
        await setTokenInStorage('token', access);
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        await removeTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { api, getTokenFromStorage, setTokenInStorage, removeTokens };
