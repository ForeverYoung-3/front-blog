import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface BlogLayoutProps {
  children: React.ReactNode;
}

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
      <div className="hero-bg" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {BUBBLES.map((b, i) => (
          <div key={i} className="bubble" style={{ left: b.left, width: b.size, height: b.size, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        {PETALS.map((p, i) => (
          <div key={i} className="petal" style={{ left: p.left, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, transform: `rotate(${p.rotate}deg)` }} />
        ))}
      </div>
      <div className="relative z-10 text-center text-white px-4 pt-16 pb-16 md:pt-20">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-5 drop-shadow-md animate-fade-up">
          相信记录的力量
        </h1>
        <p className="text-sm md:text-base text-white/75 mb-6 md:mb-8 animate-fade-up-delay tracking-wide">
          记录生活，分享技术，留住那些值得铭记的瞬间
        </p>
        <div className="flex gap-3 justify-center animate-fade-up-delay2">
          <Link to="/tags" className="px-5 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-sm hover:bg-white hover:text-indigo-600 transition-all duration-300">
            浏览分类
          </Link>
          <a href="#main-content" className="px-5 py-2 bg-indigo-500/70 backdrop-blur-sm border border-indigo-300/50 rounded-full text-sm hover:bg-indigo-500 transition-all duration-300">
            最新文章
          </a>
        </div>
      </div>
      <div className="hero-wave-wrap">
        <svg className="hero-wave-svg wave-anim-1" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="rgba(255,255,255,0.3)" />
        </svg>
        <svg className="hero-wave-svg wave-anim-2" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 C200,10 400,70 600,50 C800,30 1000,70 1200,50 C1320,38 1400,55 1440,50 L1440,80 L0,80 Z" fill="rgba(255,255,255,0.5)" />
        </svg>
        <svg className="hero-wave-svg" viewBox="0 0 1440 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 3, height: '36px' }}>
          <path d="M0,18 C240,36 480,0 720,18 C960,36 1200,4 1440,18 L1440,36 L0,36 Z" fill="#ffffff" />
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === '/';

  // 路由变化时关闭移动菜单
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 移动菜单打开时禁止 body 滚动
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLight = scrolled || !isHome;

  const navLinks = [
    ['/', '首页'],
    ['/tags', '标签'],
  ] as const;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ===== 顶部导航 ===== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navLight ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className={`text-lg font-bold tracking-widest transition-colors duration-300 ${
            navLight ? 'text-indigo-600' : 'text-white drop-shadow'
          }`}>
            ✦ My Blog
          </Link>

          {/* 桌面端搜索框 */}
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
              <button type="submit" className={`px-3 py-1.5 transition-colors ${
                navLight ? 'text-gray-400 hover:text-indigo-600' : 'text-white/70 hover:text-white'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {navLinks.map(([path, label]) => (
              <Link key={path} to={path} className={`transition-colors duration-200 ${
                location.pathname === path
                  ? navLight ? 'text-indigo-600 font-semibold' : 'text-white font-semibold'
                  : navLight ? 'text-gray-500 hover:text-indigo-500' : 'text-white/80 hover:text-white'
              }`}>
                {label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {(isEditor() || isAdmin()) && (
                  <Link to="/admin" className={`transition-colors duration-200 ${
                    navLight ? 'text-gray-500 hover:text-indigo-500' : 'text-white/80 hover:text-white'
                  }`}>
                    后台
                  </Link>
                )}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(o => !o)} className="flex items-center gap-1 focus:outline-none group">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`}
                      alt="avatar"
                      className={`w-8 h-8 rounded-full object-cover transition-all duration-200 ring-2 group-hover:ring-indigo-400 ${navLight ? 'ring-gray-200' : 'ring-white/50'}`}
                    />
                    <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${navLight ? 'text-gray-400' : 'text-white/70'}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-slide-up">
                      <div className="px-4 py-2.5 border-b border-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.nickname}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.username}</p>
                      </div>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        个人信息
                      </Link>
                      <button onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`transition-colors duration-200 ${navLight ? 'text-gray-500 hover:text-indigo-500' : 'text-white/80 hover:text-white'}`}>
                  登录
                </Link>
                <Link to="/register" className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  navLight ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white/20 border border-white/40 text-white hover:bg-white hover:text-indigo-600'
                }`}>
                  注册
                </Link>
              </>
            )}
          </nav>

          {/* 移动端右侧按钮组 */}
          <div className="flex md:hidden items-center gap-2">
            {/* 搜索按钮 */}
            <button
              onClick={() => setMobileSearchOpen(o => !o)}
              className={`p-2 rounded-lg transition-colors ${navLight ? 'text-gray-500 hover:text-indigo-600' : 'text-white/80 hover:text-white'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            {/* 汉堡菜单按钮 */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className={`p-2 rounded-lg transition-colors ${navLight ? 'text-gray-500 hover:text-indigo-600' : 'text-white/80 hover:text-white'}`}
              aria-label="菜单"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 移动端搜索展开栏 */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="搜索文章..."
                autoFocus
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm">
                搜索
              </button>
            </form>
          </div>
        )}
      </header>

      {/* 移动端全屏菜单抽屉 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          {/* 抽屉内容 */}
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* 用户信息区 */}
            <div className="p-6 pt-16 border-b border-gray-100">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{user?.nickname}</p>
                    <p className="text-xs text-gray-400">{user?.username}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 border border-indigo-300 text-indigo-600 rounded-xl text-sm font-medium">
                    登录
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">
                    注册
                  </Link>
                </div>
              )}
            </div>

            {/* 导航链接 */}
            <div className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navLinks.map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {isAuthenticated && (isEditor() || isAdmin()) && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  后台管理
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  个人信息
                </Link>
              )}
            </div>

            {/* 退出登录 */}
            {isAuthenticated && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* ===== Hero Banner（仅首页） ===== */}
      {isHome && <HeroBanner />}

      {/* ===== 主内容 ===== */}
      <main
        id="main-content"
        className={`flex-1 max-w-6xl mx-auto w-full px-4 pb-12 ${isHome ? 'pt-4' : 'pt-20 md:pt-24'}`}
      >
        {children}
      </main>

      {/* ===== 底部 ===== */}
      <footer className="bg-white border-t border-gray-100 py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs md:text-sm text-gray-400">
          © {new Date().getFullYear()} Blog Built with ForeverYoung
          &nbsp;·&nbsp; <span className="text-indigo-400">相信记录的力量</span>
        </div>
      </footer>
    </div>
  );
}
