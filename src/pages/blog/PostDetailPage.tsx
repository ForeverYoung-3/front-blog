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
    const id = slugger.slug(text);
    items.push({ level, text, id });
  }
  return items;
}

// ---- 移动端折叠目录（仅 lg 以下可见） ----
function MobileToc({ toc, activeId, onScroll }: {
  toc: TocItem[];
  activeId: string;
  onScroll: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = toc.find(t => t.id === activeId);

  return (
    <div className="lg:hidden mb-4 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 折叠触发行 */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 10h10M4 14h12M4 18h8" />
          </svg>
          <span className="font-medium text-gray-700">目录</span>
          {active && !open && (
            <span className="text-xs text-indigo-500 truncate ml-1">· {active.text}</span>
          )}
        </div>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* 展开内容 */}
      {open && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-0.5 max-h-60 overflow-y-auto">
          {toc.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={e => { e.preventDefault(); onScroll(item.id); setOpen(false); }}
              className={`block text-sm py-1.5 transition-colors ${
                item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4' : 'pl-8'
              } ${activeId === item.id ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {item.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
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

  // 目录点击跳转
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  // 目录导航（复用）
  const TocNav = ({ onClickItem }: { onClickItem?: () => void }) => (
    <nav className="space-y-0.5">
      {toc.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          onClick={e => {
            e.preventDefault();
            scrollToHeading(item.id);
            onClickItem?.();
          }}
          className={`toc-item block text-sm leading-snug py-1 transition-colors duration-150 ${
            item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-3' : 'pl-6'
          } ${activeId === item.id ? 'text-indigo-600 font-medium toc-active' : 'text-gray-500 hover:text-gray-800'}`}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );

  return (
    <div className="max-w-6xl mx-auto px-3 md:px-4">

      {/* 移动端折叠目录（仅 lg 以下，且有目录时展示） */}
      {toc.length > 0 && (
        <MobileToc toc={toc} activeId={activeId} onScroll={scrollToHeading} />
      )}

      <div className="lg:flex lg:gap-8 lg:items-start">
        {/* ======= 主内容区 ======= */}
        <article className="flex-1 min-w-0">
          <header className="mb-6 md:mb-8">
            {post.coverImage && (
              <img src={post.coverImage} alt={post.title}
                className="w-full h-48 md:h-64 object-cover rounded-xl md:rounded-2xl mb-4 md:mb-6" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 leading-snug">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
              {post.authorAvatar && (
                <img src={post.authorAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
              )}
              <span>{post.authorName}</span>
              {publishDate && <span>📅 {publishDate}</span>}
              <span>👁 {post.viewCount} 次阅读</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link key={tag.id} to={`/tag/${tag.slug}`}
                  className="text-xs px-2.5 py-1 rounded-full text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </Link>
              ))}
            </div>
          </header>

          <div ref={contentRef} className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8 post-content">
            <Viewer value={post.content ?? ''} plugins={plugins} />
          </div>

          <div className="mt-6 md:mt-8 pb-12 md:pb-16">
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">← 返回文章列表</Link>
          </div>
        </article>

        {/* 桌面端目录侧边栏 */}
        {toc.length > 0 && (
          <aside className="toc-sidebar hidden lg:block w-56 flex-shrink-0 sticky top-24 self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">目录</p>
              <TocNav />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
