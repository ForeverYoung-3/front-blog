import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Viewer } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import mermaid from '@bytemd/plugin-mermaid';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import GithubSlugger from 'github-slugger';
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import { postsApi } from '../../api/posts';

const plugins = [gfm(), highlight(), mermaid(), mediumZoom()];

// ---- 工具：从 Markdown 提取 h1~h3 标题 ----
// 使用与 ByteMD（rehype-slug + github-slugger）完全相同的算法生成 id
interface TocItem {
  level: number;
  text: string;
  id: string;
}

function extractToc(md: string): TocItem[] {
  const lines = md.split('\n');
  const items: TocItem[] = [];
  const slugger = new GithubSlugger();

  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].trim();
    // slug() 会处理去重（重复标题自动加 -1 -2 后缀），与 rehype-slug 行为一致
    const id = slugger.slug(text);
    items.push({ level, text, id });
  }
  return items;
}

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState('');

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const toc = useMemo(() => extractToc(post?.content ?? ''), [post?.content]);

  // ---- 滚动高亮当前章节 ----
  useEffect(() => {
    if (!toc.length) return;

    const headings = toc
      .map(item => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [toc, post]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-gray-500">文章不存在或已被删除</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">← 返回首页</Link>
      </div>
    );
  }

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('zh-CN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex gap-8 items-start">

        {/* ======= 主内容区 ======= */}
        <article className="flex-1 min-w-0">
          {/* 文章头部 */}
          <header className="mb-8">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {post.authorAvatar && (
                <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              )}
              <span>{post.authorName}</span>
              {publishDate && <span>📅 {publishDate}</span>}
              <span>👁 {post.viewCount} 次阅读</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link
                  key={tag.id}
                  to={`/tag/${tag.slug}`}
                  className="text-xs px-2.5 py-1 rounded-full text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </header>

          {/* Markdown 正文：ByteMD Viewer 渲染，保持与编辑器一致 */}
          <div
            ref={contentRef}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 post-content"
          >
            <Viewer value={post.content ?? ''} plugins={plugins} />
          </div>

          {/* 底部导航 */}
          <div className="mt-8 pb-16">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">← 返回文章列表</Link>
          </div>
        </article>

        {/* ======= 目录侧边栏 ======= */}
        {toc.length > 0 && (
          <aside className="toc-sidebar hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">目录</p>
              <nav className="space-y-0.5">
                {toc.map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={e => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        const offset = 80;
                        const top = el.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                        setActiveId(item.id);
                      }
                    }}
                    className={`toc-item block text-sm leading-snug py-1 transition-colors duration-150 ${
                      item.level === 1 ? 'pl-0' :
                      item.level === 2 ? 'pl-3' : 'pl-6'
                    } ${
                      activeId === item.id
                        ? 'text-indigo-600 font-medium toc-active'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
