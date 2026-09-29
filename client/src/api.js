// Axios wrapper for all backend calls.

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Normalize errors so callers can just show err.message
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const submitReview = ({ code, language }) =>
  api.post('/review', { code, language }).then((res) => res.data);

export const fetchHistory = () => api.get('/history').then((res) => res.data);

export const fetchReview = (id) => api.get(`/history/${id}`).then((res) => res.data);

export const deleteReview = (id) => api.delete(`/history/${id}`);

export default api;
