import axios from 'axios';

// Replace with your actual Python backend URL when ready.
// e.g., 'http://192.168.1.10:8000/api'
const api = axios.create({
  baseURL: 'http://YOUR_PYTHON_BACKEND_IP:8000/api',
  timeout: 10000,
});

export default api;