import request from './request';
import type { User, UpdateUserRequest, ChangePasswordRequest } from '../types';

export const usersApi = {
  /**
   * GET /users/me
   * 获取当前登录用户信息
   */
  getMe: () =>
    request.get<{ data: User }>('/users/me').then(res => res.data.data),

  /**
   * PUT /users/me
   * 更新当前用户基本信息（昵称、头像、简介、邮箱）
   */
  updateMe: (data: UpdateUserRequest) =>
    request.put<{ data: User }>('/users/me', data).then(res => res.data.data),

  /**
   * PUT /users/me/password
   * 修改当前用户密码
   */
  changePassword: (data: ChangePasswordRequest) =>
    request.put('/users/me/password', data),

  /**
   * GET /users/:id/profile
   * 公开的用户主页信息（无需登录）
   */
  getProfile: (id: number) =>
    request.get<{ data: User }>(`/users/${id}/profile`).then(res => res.data.data),
};
