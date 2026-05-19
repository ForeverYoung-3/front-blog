import request from './request';
import type { Tag, TagRequest } from '../types';

export const tagsApi = {
  /**
   * GET /tags
   * 获取所有标签列表（公开）
   */
  getAll: () =>
    request.get<{ data: Tag[] }>('/tags').then(res => res.data.data),

  /**
   * GET /tags/:id
   * 按 ID 获取标签（公开）
   */
  getById: (id: number) =>
    request.get<{ data: Tag }>(`/tags/${id}`).then(res => res.data.data),

  /**
   * GET /tags/slug/:slug
   * 按 slug 获取标签（公开）
   */
  getBySlug: (slug: string) =>
    request.get<{ data: Tag }>(`/tags/slug/${slug}`).then(res => res.data.data),

  /**
   * POST /tags
   * 创建标签（需要 ADMIN 或 EDITOR 权限）
   */
  create: (data: TagRequest) =>
    request.post<{ data: Tag }>('/tags', data).then(res => res.data.data),

  /**
   * PUT /tags/:id
   * 更新标签（需要 ADMIN 或 EDITOR 权限）
   */
  update: (id: number, data: Partial<TagRequest>) =>
    request.put<{ data: Tag }>(`/tags/${id}`, data).then(res => res.data.data),

  /**
   * DELETE /tags/:id
   * 删除标签（仅 ADMIN）
   */
  delete: (id: number) =>
    request.delete(`/tags/${id}`),
};
