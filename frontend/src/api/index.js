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
export const toggleGrievanceAgree = (id) => API.post(`/grievances/${id}/agree`);
export const resolveGrievance = (id) => API.put(`/grievances/${id}/resolve`);

// Partner APIs
export const applyPartner = (partnerData) => API.post('/partners/apply', partnerData);

// User APIs
export const fetchUserProfile = (id) => API.get(`/users/profile/${id}`);
export const updateUserProfile = (formData) => API.put('/users/profile', formData);
export const changePassword = (passwordData) => API.put('/users/change-password', passwordData);
export const fetchMyProfile = () => API.get('/users/me');

// Post APIs
export const fetchPosts = () => API.get('/posts');
export const createPost = (postData) => API.post('/posts', postData);
export const toggleLike = (id) => API.post(`/posts/${id}/like`);
export const toggleSave = (id) => API.post(`/posts/${id}/save`);
export const fetchCollegePosts = (tagName) => API.get(`/posts/college/${tagName}`);

// Comment APIs
export const fetchComments = (params) => API.get('/comments', { params });
export const addComment = (commentData) => API.post('/comments', commentData);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

// Story APIs
export const fetchStories = () => API.get('/stories');
export const createStory = (storyData) => API.post('/stories', storyData);

// Social APIs
export const followUser = (id) => API.post(`/social/follow/${id}`);
export const unfollowUser = (id) => API.delete(`/social/unfollow/${id}`);
export const fetchConnections = (id) => API.get(`/social/connections/${id}`);

export default API;
