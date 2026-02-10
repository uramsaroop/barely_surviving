import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Workouts
export const workouts = {
  create: (data) => api.post('/workouts', data),
  list: (params) => api.get('/workouts', { params }),
  get: (id) => api.get(`/workouts/${id}`),
  update: (id, data) => api.put(`/workouts/${id}`, data),
  delete: (id) => api.delete(`/workouts/${id}`),
};

// Meals
export const meals = {
  create: (data) => api.post('/meals', data),
  list: (params) => api.get('/meals', { params }),
  get: (id) => api.get(`/meals/${id}`),
  update: (id, data) => api.put(`/meals/${id}`, data),
  delete: (id) => api.delete(`/meals/${id}`),
  getDailySummary: (date) => api.get('/meals/daily-summary', { params: { target_date: date } }),
};

// Weight
export const weight = {
  create: (data) => api.post('/weight', data),
  list: (params) => api.get('/weight', { params }),
  get: (id) => api.get(`/weight/${id}`),
  delete: (id) => api.delete(`/weight/${id}`),
  getTrend: (days = 7) => api.get('/weight/trend', { params: { days } }),
};

// Goals
export const goals = {
  createOrUpdate: (data) => api.post('/goals', data),
  get: () => api.get('/goals'),
  getProgress: () => api.get('/goals/progress'),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Dashboard
export const dashboard = {
  getStats: (date) => api.get('/dashboard/stats', { params: { target_date: date } }),
  getStreak: () => api.get('/dashboard/streak'),
  getRecentActivity: (limit = 10) => api.get('/dashboard/recent-activity', { params: { limit } }),
};

export default api;
