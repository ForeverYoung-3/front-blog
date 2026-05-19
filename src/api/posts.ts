import request from './request';
import type { Post, PostRequest, PostStatus, PageResult, BlogStats } from '../types';

export const postsApi = {
  // 公开接口
  getPublished: (page = 0, size = 10) =>
    request.get<{ data: PageResult<Post> }>('/posts', { params: { page, size } })
      .then(res => res.data.data),

  getById: (id: number) =>
    request.get<{ data: Post }>(`/posts/${id}`)
      .then(res => res.data.data),

  getBySlug: (slug: string) =>
    request.get<{ data: Post }>(`/posts/slug/${slug}`)
      .then(res => res.data.data),

  getByTag: (tagSlug: string, page = 0, size = 10) =>
    request.get<{ data: PageResult<Post> }>(`/posts/tag/${tagSlug}`, { params: { page, size } })
      .then(res => res.data.data),

  search: (keyword: string, page = 0, size = 10) =>
    request.get<{ data: PageResult<Post> }>('/posts/search', { params: { keyword, page, size } })
      .then(res => res.data.data),

  // 需要认证
  getMyPosts: (status?: PostStatus, page = 0, size = 10) =>
    request.get<{ data: PageResult<Post> }>('/posts/my', { params: { status, page, size } })
      .then(res => res.data.data),

  create: (data: PostRequest) =>
    request.post<{ data: Post }>('/posts', data)
      .then(res => res.data.data),

  update: (id: number, data: PostRequest) =>
    request.put<{ data: Post }>(`/posts/${id}`, data)
      .then(res => res.data.data),

  delete: (id: number) =>
    request.delete(`/posts/${id}`),

  publish: (id: number) =>
    request.post<{ data: Post }>(`/posts/${id}/publish`)
      .then(res => res.data.data),

  archive: (id: number) =>
    request.post<{ data: Post }>(`/posts/${id}/archive`)
      .then(res => res.data.data),

  /**
   * GET /posts/stats
   * 公开统计：已发布文章数、标签数、总浏览量（无需登录）
   */
  getStats: () =>
    request.get<{ data: BlogStats }>('/posts/stats').then(res => res.data.data),
};
