import axios from 'axios';
import { config } from './config';

export const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true, // Important for CSRF cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Function to get CSRF cookie
export const getCsrfCookie = async (): Promise<void> => {
  try {
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Failed to fetch CSRF cookie:', error);
  }
};

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Auth API with CSRF handling
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    // Get CSRF cookie before making the request
    await getCsrfCookie();
    return api.post<ApiResponse<{ user: User; token: string; token_type: string }>>('/register', data);
  },

  login: async (data: { email: string; password: string }) => {
    // Get CSRF cookie before making the request
    await getCsrfCookie();
    return api.post<ApiResponse<{ user: User; token: string; token_type: string }>>('/login', data);
  },

  logout: () => api.post<ApiResponse<null>>('/logout'),
};

// Tasks API
export const tasksApi = {
  getTasks: (params?: { status?: string; search?: string }) =>
    api.get<ApiResponse<Task[]>>('/tasks', { params }),

  createTask: (data: { title: string; description?: string; status: Task['status'] }) =>
    api.post<ApiResponse<Task>>('/tasks', data),

  updateTask: (id: number, data: Partial<{ title: string; description: string; status: Task['status'] }>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, data),

  deleteTask: (id: number) => api.delete<ApiResponse<null>>(`/tasks/${id}`),

  getTask: (id: number) => api.get<ApiResponse<Task>>(`/tasks/${id}`),
};

// Admin API
export const adminApi = {
  getAllTasks: (params?: { status?: string; search?: string }) =>
    api.get<ApiResponse<Task[]>>('/admin/tasks', { params }),
};