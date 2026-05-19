// ---- 通用 ----
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** 当前页码（0-based） */
  number: number;
  size: number;
}

// ---- 用户 ----
export type Role = 'ROLE_ADMIN' | 'ROLE_EDITOR' | 'ROLE_VIEWER';

export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  role: Role;
  enabled: boolean;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

/** PUT /users/me 请求体 */
export interface UpdateUserRequest {
  nickname?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  /** 仅管理员可改 */
  role?: Role;
  /** 仅管理员可改 */
  enabled?: boolean;
}

/** PUT /users/me/password 请求体（前端自行约定，后端接受 oldPassword + newPassword） */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  nickname: string;
  avatar?: string;
  role: Role;
}

// ---- 标签 ----
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  description?: string;
  postCount: number;
  createdAt: string;
}

/** POST /tags 或 PUT /tags/:id 请求体 */
export interface TagRequest {
  name: string;
  slug?: string;
  /** 颜色值，如 #FF5733，最多 10 字符 */
  color?: string;
  description?: string;
}

// ---- 文章 ----
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  contentHtml?: string;
  coverImage?: string;
  status: PostStatus;
  pinned: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  tags: Tag[];
}

export interface PostRequest {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  coverImage?: string;
  status?: PostStatus;
  pinned?: boolean;
  tagIds?: number[];
}

// ---- 管理员统计 ----
export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  totalTags: number;
  totalViews: number;
}

// ---- 公开统计（首页作者卡片：无需登录） ----
export interface BlogStats {
  /** 已发布文章数 */
  totalPosts: number;
  /** 标签总数 */
  totalTags: number;
  /** 全站总浏览量（所有文章 view_count 之和） */
  totalViews: number;
}
