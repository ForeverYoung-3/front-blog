import { Link } from 'react-router-dom';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : new Date(post.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <article className="post-card group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-gray-100 cursor-pointer h-full flex flex-col">

      {/* ── 移动端：横向紧凑布局 ── */}
      <div className="flex sm:hidden">
        {/* 左侧缩略图 */}
        <Link to={`/post/${post.slug}`} className="flex-shrink-0 w-24 h-24 overflow-hidden relative">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
              <span className="text-2xl opacity-40">📝</span>
            </div>
          )}
          {post.pinned && (
            <span className="absolute top-1 left-1 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              📌
            </span>
          )}
        </Link>

        {/* 右侧内容 */}
        <div className="flex-1 min-w-0 p-3 flex flex-col justify-between">
          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-1">
            {post.tags.slice(0, 2).map(tag => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                onClick={e => e.stopPropagation()}
                className="text-[10px] px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
          {/* 标题 */}
          <Link to={`/post/${post.slug}`}>
            <h2 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h2>
          </Link>
          {/* 底部 */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
            <span>{publishDate}</span>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 桌面端：原有竖向卡片布局 ── */}
      <div className="hidden sm:flex flex-col flex-1">
        {/* 封面图 */}
        <Link to={`/post/${post.slug}`} className="block overflow-hidden relative">
          {post.coverImage ? (
            <div className="relative h-44 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {post.pinned && (
                <span className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  📌 置顶
                </span>
              )}
            </div>
          ) : (
            <div className="h-44 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
              <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">📝</span>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
              {post.pinned && (
                <span className="absolute top-2 left-2 bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  📌 置顶
                </span>
              )}
            </div>
          )}
        </Link>

        {/* 内容区 */}
        <div className="p-4 flex flex-col flex-1">
          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 2).map(tag => (
              <Link
                key={tag.id}
                to={`/tag/${tag.slug}`}
                onClick={e => e.stopPropagation()}
                className="text-xs px-2 py-0.5 rounded-full text-white hover:opacity-80 transition-all duration-200 hover:scale-105 inline-block"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                +{post.tags.length - 2}
              </span>
            )}
          </div>

          {/* 标题 */}
          <Link to={`/post/${post.slug}`}>
            <h2 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2 mb-2 leading-snug">
              {post.title}
            </h2>
          </Link>

          {/* 摘要 */}
          {post.summary && (
            <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed flex-1">
              {post.summary}
            </p>
          )}

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2">
              {post.authorAvatar ? (
                <img src={post.authorAvatar} alt={post.authorName} className="w-4 h-4 rounded-full" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 text-xs">
                  {post.authorName.charAt(0)}
                </span>
              )}
              <span className="text-gray-500 text-xs">{publishDate}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.viewCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

    </article>
  );
}
