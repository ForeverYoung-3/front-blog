import axios from 'axios';
import type { ApiResponse } from '../types';
import { toast } from '../components/common/Toast';
import { useAuthStore } from '../store/authStore';

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
      // 清除认证状态
      useAuthStore.getState().logout();

      // 给用户明确的提示
      toast.error('登录已过期，请重新登录');

      // 记录当前页面路径，登录后可回跳（避免在登录页本身时记录）
      const currentPath = window.location.pathname;
      const redirectParam = currentPath !== '/login'
        ? `?redirect=${encodeURIComponent(currentPath + window.location.search)}`
        : '';

      // 延迟 800ms 让 toast 先展示再跳转
      setTimeout(() => {
        window.location.href = `/login${redirectParam}`;
      }, 800);

      return Promise.reject(new Error('登录已过期，请重新登录'));
    }

    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

export default request;
