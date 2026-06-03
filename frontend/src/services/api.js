import axios from 'axios';

// Use relative URL to leverage proxy in development
const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

console.log('API configured with baseURL:', API_URL);

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (email, password) => api.post('/auth/signup', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
};

export const levelService = {
  getLevels: () => api.get('/levels'),
  getLevelWords: (levelId) => api.get(`/levels/${levelId}`),
};

export const submissionService = {
  verifySubmission: (videoFile, expectedWord) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('expectedWord', expectedWord);
    
    return api.post('/submissions/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
