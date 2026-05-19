import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface BlogLayoutProps {
  children: React.ReactNode;
}

// 预设气泡数据，固定值避免每次渲染随机闪烁
const BUBBLES = [
  { left: '5%',  size: 8,  duration: 9,  delay: 0 },
  { left: '12%', size: 14, duration: 12, delay: 1.5 },
  { left: '22%', size: 6,  duration: 8,  delay: 3 },
  { left: '33%', size: 10, duration: 14, delay: 0.5 },
  { left: '45%', size: 7,  duration: 10, delay: 2 },
  { left: '55%', size: 12, duration: 11, delay: 4 },
  { left: '63%', size: 9,  duration: 13, delay: 1 },
  { left: '72%', size: 6,  duration: 9,  delay: 5 },
  { left: '80%', size: 11, duration: 15, delay: 2.5 },
  { left: '88%', size: 8,  duration: 10, delay: 0 },
  { left: '93%', size: 5,  duration: 7,  delay: 3.5 },
  { left: '38%', size: 13, duration: 12, delay: 6 },
];

// 花瓣预设（增加数量，错开 delay 确保每时每刻都有花瓣在飘）
const PETALS = [
  { left: '5%',  duration: 7,  delay: 0,   rotate: 20  },
  { left: '12%', duration: 9,  delay: 1,   rotate: -15 },
  { left: '20%', duration: 8,  delay: 3,   rotate: 30  },
  { left: '28%', duration: 10, delay: 0.5, rotate: -10 },
  { left: '36%', duration: 7,  delay: 2,   rotate: 25  },
  { left: '45%', duration: 9,  delay: 4,   rotate: -20 },
  { left: '53%', duration: 8,  delay: 1.5, rotate: 15  },
  { left: '61%', duration: 11, delay: 3.5, rotate: -30 },
  { left: '70%', duration: 7,  delay: 0.8, rotate: 10  },
  { left: '78%', duration: 9,  delay: 2.5, rotate: -25 },
  { left: '86%', duration: 8,  delay: 5,   rotate: 20  },
  { left: '93%', duration: 10, delay: 1.2, rotate: -15 },
];

function HeroBanner() {
  return (
    <div className="hero-banner">
      {/* 海洋渐变背景 */}
      <div className="hero-bg" />

      {/* 气泡层 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 花瓣飘落层：不裁切，让花瓣从顶部外侧开始飘入 */}
      <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="petal"
            style={{
              left: p.left,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* 文字内容，垂直居中偏上，不被波浪遮住 */}
      <div className="relative z-10 text-center text-white px-4 pt-20 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-5 drop-shadow-md animate-fade-up">
          相信记录的力量
        </h1>
        <p className="text-base text-white/75 mb-8 animate-fade-up-delay tracking-wide">
          记录生活，分享技术，留住那些值得铭记的瞬间
        </p>
        <div className="flex gap-3 justify-center animate-fade-up-delay2">
          <Link
            to="/tags"
            className="px-6 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-sm
                       hover:bg-white hover:text-indigo-600 transition-all duration-300"
          >
            浏览分类
          </Link>
          <a
            href="#main-content"
            className="px-6 py-2 bg-indigo-500/70 backdrop-blur-sm border border-indigo-300/50 rounded-full text-sm
                       hover:bg-indigo-500 transition-all duration-300"
          >
            最新文章
          </a>
        </div>
      </div>

      {/* SVG 波浪：3层叠加，最底层用白色与正文区无缝衔接 */}
      <div className="hero-wave-wrap">
        {/* 第1层：半透明装饰 */}
        <svg
          className="hero-wave-svg wave-anim-1"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
        {/* 第2层：半透明装饰 */}
        <svg
          className="hero-wave-svg wave-anim-2"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 C200,10 400,70 600,50 C800,30 1000,70 1200,50 C1320,38 1400,55 1440,50 L1440,80 L0,80 Z"
            fill="rgba(255,255,255,0.5)"
          />
        </svg>
        {/* 第3层：纯白实色，紧贴底部，与正文区白色/浅灰背景无缝衔接，消除缝隙 */}
        <svg
          className="hero-wave-svg"
          viewBox="0 0 1440 36"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 3, height: '36px' }}
        >
          <path
            d="M0,18 C240,36 480,0 720,18 C960,36 1200,4 1440,18 L1440,36 L0,36 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
  );
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const { isAuthenticated, user, logout, isAdmin, isEditor } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLight = scrolled || !isHome;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ===== 顶部导航 ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navLight ? 'bg-white/92 backdrop-blur-md shadow-sm py-2.5' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={`text-lg font-bold tracking-widest transition-colors duration-300 ${
              navLight ? 'text-indigo-600' : 'text-white drop-shadow'
            }`}
          >
            ✦ My Blog
          </Link>

          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className={`flex rounded-full overflow-hidden border transition-all duration-300 ${
              navLight ? 'border-gray-200 bg-white shadow-sm' : 'border-white/30 bg-white/15 backdrop-blur-sm'
            }`}>
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="搜索文章..."
                className={`px-4 py-1.5 text-sm bg-transparent focus:outline-none w-44 ${
                  navLight ? 'text-gray-700 placeholder-gray-400' : 'text-white placeholder-white/60'
                }`}
              />
              <button
                type="submit"
                className={`px-3 py-1.5 text-sm transition-colors ${
                  navLight ? 'text-gray-400 hover:text-indigo-600' : 'text-white/70 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 导航链接 */}
          <nav className="flex items-center gap-5 text-sm font-medium">
            {[['/', '首页'], ['/tags', '标签']] .map(([path, label]) => (
              <Link
                key={path}
                to={path}
                className={`transition-colors duration-200 ${
                  location.pathname === path
                    ? navLight ? 'text-indigo-600 font-semibold' : 'text-white font-semibold'
                    : navLight ? 'text-gray-500 hover:text-indigo-500' : 'text-white/80 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {(isEditor() || isAdmin()) && (
                  <Link
                    to="/admin"
                    className={`transition-colors duration-200 ${
                      navLight ? 'text-gray-500 hover:text-indigo-500' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    后台
                  </Link>
                )}
                {/* 头像下拉菜单 */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-1 focus:outline-none group"
                  >
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`}
                      alt="avatar"
                      className={`w-8 h-8 rounded-full object-cover transition-all duration-200
                        ring-2 group-hover:ring-indigo-400
                        ${navLight ? 'ring-gray-200' : 'ring-white/50'}`}
                    />
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}
                        ${navLight ? 'text-gray-400' : 'text-white/70'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-slide-up">
                      <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.nickname}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.username}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        个人信息
                      </Link>
                      <button
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`transition-colors duration-200 ${
                    navLight ? 'text-gray-500 hover:text-indigo-500' : 'text-white/80 hover:text-white'
                  }`}
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
                    navLight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white/20 border border-white/40 text-white hover:bg-white hover:text-indigo-600'
                  }`}
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ===== Hero Banner（仅首页） ===== */}
      {isHome && <HeroBanner />}

      {/* ===== 主内容：不叠加，正常流排列 ===== */}
      <main
        id="main-content"
        className={`flex-1 max-w-6xl mx-auto w-full px-4 pb-12 ${isHome ? 'pt-6' : 'pt-24'}`}
      >
        {children}
      </main>

      {/* ===== 底部 ===== */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Blog Built with ForeverYoung
          &nbsp;·&nbsp; <span className="text-indigo-400">相信记录的力量</span>
        </div>
      </footer>
    </div>
  );
}
