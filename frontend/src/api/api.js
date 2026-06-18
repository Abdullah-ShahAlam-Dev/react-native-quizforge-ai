import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// // Replace with your actual Python backend URL when ready.
const api = axios.create({
  baseURL: 'http://192.168.0.100:8000', // ipconfig se IPv4 address nikalo, no /api suffix
  timeout: 10000,
});

// ── Request Interceptor — attach JWT to every outgoing request ──
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Token attach failed:', e.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor — clear session on 401 (expired/invalid token) ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.multiRemove(['userToken', 'userName']);
      // The next screen that checks auth state (Splash, or a protected
      // screen) will naturally redirect to Login since the token is gone.
    }
    return Promise.reject(error);
  }
);

export default api;