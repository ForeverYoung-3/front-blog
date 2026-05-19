import request from './request';
import type { User, Post, PostStatus, PageResult, AdminStats, UpdateUserRequest } from '../types';

export const adminApi = {
  /**
   * GET /admin/stats
   * 获取站点统计概览（仅 ADMIN）
   */
  getStats: () =>
    request.get<{ data: AdminStats }>('/admin/stats').then(res => res.data.data),

  // ---------- 用户管理 ----------

  /**
   * GET /admin/users
   * 获取所有用户列表（仅 ADMIN）
   */
  getUsers: () =>
    request.get<{ data: User[] }>('/admin/users').then(res => res.data.data),

  /**
   * GET /admin/users/:id
   * 获取指定用户详情（仅 ADMIN）
   */
  getUserById: (id: number) =>
    request.get<{ data: User }>(`/admin/users/${id}`).then(res => res.data.data),

  /**
   * PUT /admin/users/:id
   * 更新指定用户信息（仅 ADMIN，可修改 role / enabled 等）
   */
  updateUser: (id: number, data: UpdateUserRequest) =>
    request.put<{ data: User }>(`/admin/users/${id}`, data).then(res => res.data.data),

  /**
   * DELETE /admin/users/:id
   * 删除指定用户（仅 ADMIN）
   */
  deleteUser: (id: number) =>
    request.delete(`/admin/users/${id}`),

  // ---------- 文章管理 ----------

  /**
   * GET /admin/posts
   * 获取所有文章（含任意状态，仅 ADMIN）
   */
  getAllPosts: (status?: PostStatus, page = 0, size = 10) =>
    request
      .get<{ data: PageResult<Post> }>('/admin/posts', { params: { status, page, size } })
      .then(res => res.data.data),
};
