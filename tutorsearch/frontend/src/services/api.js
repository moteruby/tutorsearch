import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(request => {
  return request;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401 && 
        (window.location.pathname === '/login' || 
         window.location.pathname === '/register')) {
      return Promise.reject(error);
    }

    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default api; 