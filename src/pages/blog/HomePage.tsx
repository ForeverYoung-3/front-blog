import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../../api/posts';
import { tagsApi } from '../../api/tags';
import PostCard from '../../components/common/PostCard';
import Pagination from '../../components/common/Pagination';
import { Link } from 'react-router-dom';
import type { Post, Tag, BlogStats } from '../../types';

// ===================== Mock 数据 =====================
const MOCK_TAGS: Tag[] = [
  { id: 1, name: 'React', slug: 'react', color: '#61dafb', postCount: 12, createdAt: '' },
  { id: 2, name: 'TypeScript', slug: 'typescript', color: '#3178c6', postCount: 8, createdAt: '' },
  { id: 3, name: 'Vite', slug: 'vite', color: '#646cff', postCount: 5, createdAt: '' },
  { id: 4, name: 'Spring Boot', slug: 'spring-boot', color: '#6db33f', postCount: 9, createdAt: '' },
  { id: 5, name: '生活随笔', slug: 'life', color: '#f97316', postCount: 15, createdAt: '' },
  { id: 6, name: '读书笔记', slug: 'reading', color: '#8b5cf6', postCount: 7, createdAt: '' },
  { id: 7, name: 'AI 前沿', slug: 'ai', color: '#ec4899', postCount: 11, createdAt: '' },
  { id: 8, name: '工具推荐', slug: 'tools', color: '#14b8a6', postCount: 6, createdAt: '' },
];

const MOCK_POSTS: Post[] = [
  {
    id: 1, title: '【AI更新】poetize v4.2 新功能全解析', slug: 'poetize-v4-2',
    summary: '本次更新带来了全新的 AI 写作辅助功能，支持智能摘要生成、风格迁移等多项创新特性，大幅提升创作效率。',
    coverImage: 'https://picsum.photos/seed/ai1/400/240',
    status: 'PUBLISHED', pinned: true, viewCount: 2748, publishedAt: '2025-02-13T12:00:00',
    createdAt: '2025-02-13T12:00:00', updatedAt: '2025-02-13T12:00:00',
    authorId: 1, authorName: 'POETIZE',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=poetize',
    tags: [MOCK_TAGS[0], MOCK_TAGS[6]],
  },
  {
    id: 2, title: 'POETIZE - AI 驱动的新一代博客平台', slug: 'poetize-ai',
    summary: '探索如何用 AI 重新定义个人博客体验，从智能推荐到自动标签，让写作更专注于内容本身。',
    coverImage: 'https://picsum.photos/seed/ai2/400/240',
    status: 'PUBLISHED', pinned: false, viewCount: 1893, publishedAt: '2025-02-11T09:00:00',
    createdAt: '2025-02-11T09:00:00', updatedAt: '2025-02-11T09:00:00',
    authorId: 1, authorName: 'POETIZE',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=poetize',
    tags: [MOCK_TAGS[1], MOCK_TAGS[6]],
  },
  {
    id: 3, title: '博客发展史：那些让我印象深刻的设计变迁', slug: 'blog-history',
    summary: '从最早期的个人主页到现代化博客平台，记录了十年间我所见过的那些令人叹服的界面设计演变历程。',
    coverImage: 'https://picsum.photos/seed/blog3/400/240',
    status: 'PUBLISHED', pinned: false, viewCount: 1204, publishedAt: '2025-01-25T16:30:00',
    createdAt: '2025-01-25T16:30:00', updatedAt: '2025-01-25T16:30:00',
    authorId: 1, authorName: 'POETIZE',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=poetize',
    tags: [MOCK_TAGS[4]],
  },
  {
    id: 4, title: 'React 19 新特性深度解析与实战案例', slug: 'react-19',
    summary: 'React 19 带来了 Actions、use Hook、Server Components 等重磅更新，本文通过实战案例带你快速掌握这些新特性。',
    coverImage: 'https://picsum.photos/seed/react4/400/240',
    status: 'PUBLISHED', pinned: false, viewCount: 3412, publishedAt: '2025-01-20T10:00:00',
    createdAt: '2025-01-20T10:00:00', updatedAt: '2025-01-20T10:00:00',
    authorId: 1, authorName: 'POETIZE',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=poetize',
    tags: [MOCK_TAGS[0], MOCK_TAGS[1]],
  },
  {
    id: 5, title: '用 Vite 构建极速前端工作流', slug: 'vite-workflow',
    summary: '介绍如何配置 Vite 实现模块热替换、代码分割、按需加载，打造秒级启动的现代前端开发环境。',
    coverImage: 'https://picsum.photos/seed/vite5/400/240',
    status: 'PUBLISHED', pinned: false, viewCount: 987, publishedAt: '2025-01-15T14:00:00',
    createdAt: '2025-01-15T14:00:00', updatedAt: '2025-01-15T14:00:00',
    authorId: 1, authorName: 'POETIZE',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=poetize',
    tags: [MOCK_TAGS[2]],
  },
  {
    id: 6, title: '2025 年值得收藏的 10 款开发工具', slug: 'dev-tools-2025',
    summary: '精选 10 款能显著提升开发效率的工具，涵盖 AI 辅助编码、API 调试、数据库管理、部署运维等多个维度。',
    coverImage: 'https://picsum.photos/seed/tools6/400/240',
    status: 'PUBLISHED', pinned: false, viewCount: 2156, publishedAt: '2025-01-08T11:00:00',
    createdAt: '2025-01-08T11:00:00', updatedAt: '2025-01-08T11:00:00',
    authorId: 1, authorName: 'POETIZE',
    authorAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=poetize',
    tags: [MOCK_TAGS[7]],
  },
];

// 浏览量格式化：>= 10000 显示 x.xk
function formatViews(n: number): string {
  if (n >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

// ===================== 作者卡片 =====================
function AuthorCard({ tags, stats }: { tags: Tag[]; stats?: BlogStats }) {
  return (
    <div className="author-card bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 animate-slide-up overflow-hidden">

      {/* 顶部光晕背景 + 居中头像 */}
      <div className="relative pt-8 pb-4 flex flex-col items-center"
        style={{
          background: 'linear-gradient(160deg, #e0e7ff 0%, #f5d0fe 50%, #fce7f3 100%)',
        }}
      >
        {/* 装饰光晕 */}
        <div className="absolute top-2 left-6 w-16 h-16 rounded-full bg-white/40 blur-xl" />
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-purple-200/50 blur-lg" />

        {/* 头像 — 完整展示，不被任何元素遮挡 */}
        <div className="relative z-10 w-20 h-20 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-white">
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=myblog"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 昵称 & 链接 */}
        <div className="relative z-10 mt-3 text-center">
          <h3 className="font-bold text-gray-800 text-base leading-tight">ForeverYoung</h3>
          <p className="text-gray-400 text-xs mt-0.5">https://fapwyyforever.love</p>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* 统计数据 */}
        <div className="flex justify-around text-center mb-4 py-3 bg-gray-50 rounded-xl">
          {([
            [stats ? String(stats.totalPosts) : '–', '文章'],
            [stats ? String(stats.totalTags)  : '–', '标签'],
            [stats ? formatViews(stats.totalViews) : '–', '浏览'],
          ] as [string, string][]).map(([val, label]) => (
            <div key={label}>
              <div className="font-bold text-gray-800 text-sm">{val}</div>
              <div className="text-gray-400 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* 标签云 */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2.5 font-medium">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            标签云
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                className="text-xs px-2.5 py-1 rounded-full text-white hover:opacity-85 hover:scale-105
                           transition-all duration-200 inline-block shadow-sm"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
                {tag.postCount > 0 && <span className="ml-1 opacity-70">({tag.postCount})</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================== 首页 =====================
export default function HomePage() {
  const [page, setPage] = useState(0);

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => postsApi.getPublished(page, 9),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  const { data: blogStats } = useQuery({
    queryKey: ['blog-stats'],
    queryFn: postsApi.getStats,
    staleTime: 60 * 1000, // 1 分钟内不重新请求
  });

  // 若接口无数据则使用 Mock
  const posts = (postsData?.content && postsData.content.length > 0) ? postsData.content : MOCK_POSTS;
  const tags = (tagsData && tagsData.length > 0) ? tagsData : MOCK_TAGS;
  const totalElements = postsData?.totalElements ?? MOCK_POSTS.length;
  const isMock = !postsData?.content?.length;

  // 右侧边栏内容（复用于桌面右列 & 移动端底部）
  const SidebarContent = () => (
    <>
      <AuthorCard tags={tags} stats={blogStats} />
      <div className="bg-white rounded-2xl shadow-md p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 font-medium">
          <span>🔥</span> 热门文章
        </div>
        <div className="space-y-3">
          {posts.slice(0, 4).map((post, i) => (
            <Link key={post.id} to={`/post/${post.slug}`} className="flex items-start gap-2 group">
              <span className={`w-5 h-5 rounded text-xs font-bold flex-shrink-0 flex items-center justify-center mt-0.5 ${
                i === 0 ? 'bg-red-500 text-white' :
                i === 1 ? 'bg-orange-400 text-white' :
                i === 2 ? 'bg-yellow-400 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>{i + 1}</span>
              <span className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed">
                {post.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="lg:flex lg:gap-6 lg:items-start">
      {/* ===== 主内容 ===== */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
            <h2 className="text-base font-bold text-gray-800">最新</h2>
            {isMock && (
              <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">演示数据</span>
            )}
          </div>
          <Link to="/tags" className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors">
            MORE →
          </Link>
        </div>

        {/* 文章网格：移动端单列，sm 双列，桌面（边栏存在时）双列 */}
        {postsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post, idx) => (
              <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {!isMock && postsData && (
          <div className="mt-8">
            <Pagination current={page} total={totalElements} pageSize={9} onChange={setPage} />
          </div>
        )}

        {/* 移动端边栏：文章列表下方 */}
        <div className="lg:hidden mt-8">
          <SidebarContent />
        </div>
      </div>

      {/* ===== 右侧边栏（仅 lg+） ===== */}
      <aside className="w-60 hidden lg:block flex-shrink-0">
        <SidebarContent />
      </aside>
    </div>
  );
}
