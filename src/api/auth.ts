import request from './request';
import type { AuthResponse } from '../types';

export const authApi = {
  login: (username: string, password: string) =>
    request.post<{ data: AuthResponse }>('/auth/login', { username, password })
      .then(res => res.data.data),

  register: (data: { username: string; email: string; password: string; nickname?: string }) =>
    request.post<{ data: AuthResponse }>('/auth/register', data)
      .then(res => res.data.data),
};
