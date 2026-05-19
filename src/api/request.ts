import axios from 'axios';
import type { ApiResponse } from '../types';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// 请求拦截器：自动附加 JWT Token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response) => {
    const data: ApiResponse<unknown> = response.data;
    if (data.code !== 200) {
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export default request;
