import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactElement;
  exact?: boolean;
  adminOnly?: boolean;
}

interface MenuGroup {
  title: string;
  adminOnly?: boolean;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: '内容管理',
    items: [
      {
        path: '/admin', exact: true, label: '概览',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>,
      },
      {
        path: '/admin/posts', label: '文章管理',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      },
      {
        path: '/admin/posts/new', label: '写文章',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      },
      {
        path: '/admin/tags', label: '标签管理',
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
      },
    ],
  },
  {
    title: '系统', adminOnly: true,
    items: [
      {
        path: '/admin/users', label: '用户管理', adminOnly: true,
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isAdmin } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    if (path === '/admin/posts' && location.pathname === '/admin/posts/new') return false;
    return location.pathname === path || (!exact && location.pathname.startsWith(path) && path !== '/admin');
  };

  const currentLabel = menuGroups.flatMap(g => g.items).find(m => isActive(m.path, m.exact))?.label || '管理后台';

  return (
    <div className="min-h-screen flex" style={{ background: '#faf8f5' }}>

      {/* ===== 侧边栏 ===== */}
      <aside
        className={`relative flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
        style={{ background: 'linear-gradient(180deg, #fffbf7 0%, #fff8f2 100%)', borderRight: '1px solid #f0e8de' }}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-orange-100 ${collapsed ? 'justify-center' : 'px-5 gap-3'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="font-bold text-gray-700 text-sm tracking-wide truncate">Blog Admin</span>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          )}
        </div>

        {/* 菜单 */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {menuGroups.map(group => {
            if (group.adminOnly && !isAdmin()) return null;
            return (
              <div key={group.title} className="mb-1">
                {!collapsed && (
                  <p className="text-[10px] font-semibold text-orange-300 uppercase tracking-widest px-5 mb-1.5 mt-3">
                    {group.title}
                  </p>
                )}
                {group.items.map(item => {
                  if (item.adminOnly && !isAdmin()) return null;
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm
                        transition-all duration-150 group
                        ${active ? 'bg-orange-50 text-orange-700 font-medium shadow-sm' : 'text-gray-500 hover:bg-orange-50/60 hover:text-orange-600'}
                        ${collapsed ? 'justify-center' : ''}`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-400 rounded-r-full" />
                      )}
                      <span className={`flex-shrink-0 transition-colors ${active ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-500'}`}>
                        {item.icon}
                      </span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* 用户区 */}
        <div className="border-t border-orange-100 p-3">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`}
                alt="avatar"
                className="w-8 h-8 rounded-full ring-2 ring-orange-100 flex-shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 text-xs font-medium truncate">{user?.nickname}</p>
                <p className="text-gray-400 text-[10px] truncate">{user?.role === 'ROLE_ADMIN' ? '管理员' : '编辑'}</p>
              </div>
              <button onClick={handleLogout} title="退出登录"
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} title="退出登录"
              className="w-full flex justify-center text-gray-300 hover:text-red-400 transition-colors py-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>

        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-md border border-orange-100
                     flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors z-10"
        >
          <svg className={`w-3 h-3 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* ===== 主内容区 ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-16 bg-white border-b border-orange-50 px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/admin" className="hover:text-orange-500 transition-colors">后台</Link>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-700 font-medium">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/posts/new"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              写文章
            </Link>
            <Link to="/"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              博客前台
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
