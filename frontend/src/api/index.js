import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the token in all requests
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

// Auth APIs
export const login = (formData) => API.post('/auth/login', formData);
export const signup = (formData) => API.post('/auth/signup', formData);
export const googleAuth = (idToken, type = 'login') => API.post('/auth/google', { idToken, type });

// Grievance APIs
export const fetchGrievances = () => API.get('/grievances');
export const createGrievance = (grievanceData) => API.post('/grievances', grievanceData);

// Partner APIs
export const applyPartner = (partnerData) => API.post('/partners/apply', partnerData);

export default API;
