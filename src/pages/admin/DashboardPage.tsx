import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { useAuthStore } from '../../store/authStore';
import type { RecentPost } from '../../types';

// 统计数据兜底（仅在接口未返回时显示）
const EMPTY_STATS: {
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalTags: number;
  totalViews: number;
  recentPosts: RecentPost[];
} = {
  totalUsers: 0,
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  totalTags: 0,
  totalViews: 0,
  recentPosts: [],
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
}

function StatCard({ label, value, icon, gradient, trend }: StatCardProps) {
  return (
    <div className={`relative rounded-2xl p-5 overflow-hidden text-white shadow-md ${gradient}`}>
      {/* 背景装饰圆 */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/8" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          {trend && (
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{trend}</span>
          )}
        </div>
        <p className="text-3xl font-bold leading-none mb-1">{value}</p>
        <p className="text-sm text-white/75">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
    staleTime: 0,
  });

  const s = stats ?? EMPTY_STATS;

  // 获取当前时间段问候语
  const hour = new Date().getHours();
  const greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <div className="space-y-6">

      {/* 欢迎横幅 */}
      <div className="relative rounded-2xl overflow-hidden p-6 text-white shadow-md"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)' }}
      >
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="150" cy="50" r="80" fill="white" />
            <circle cx="50" cy="150" r="60" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">{greeting}，</p>
            <h2 className="text-2xl font-bold mb-1">{user?.nickname} 👋</h2>
            <p className="text-white/60 text-sm">今天也是充满活力的一天，继续创作吧！</p>
          </div>
          <Link
            to="/admin/posts/new"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600
                       rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            写新文章
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">数据概览</h3>
          {!stats && <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full animate-pulse">加载中...</span>}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            label="总用户数"
            value={s.totalUsers ?? 0}
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatCard
            label="总文章数"
            value={s.totalPosts ?? 0}
            gradient="bg-gradient-to-br from-orange-500 to-red-500"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
          <StatCard
            label="已发布"
            value={s.publishedPosts ?? 0}
            gradient="bg-gradient-to-br from-teal-400 to-emerald-500"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="草稿"
            value={s.draftPosts ?? 0}
            gradient="bg-gradient-to-br from-yellow-400 to-amber-500"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
          />
          <StatCard
            label="标签数"
            value={s.totalTags ?? 0}
            gradient="bg-gradient-to-br from-rose-400 to-pink-500"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>}
          />
          <StatCard
            label="总浏览量"
            value={s.totalViews}
            gradient="bg-gradient-to-br from-red-400 to-rose-500"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          />
        </div>
      </div>

      {/* 下方两栏 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* 快捷操作 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">快捷操作</h3>
          </div>
          <div className="p-4 space-y-2.5">
            {[
              {
                to: '/admin/posts/new', label: '写新文章', desc: '开始创作新内容',
                cls: 'bg-indigo-50 text-indigo-600',
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
              },
              {
                to: '/admin/posts', label: '管理文章', desc: '查看、编辑、删除文章',
                cls: 'bg-blue-50 text-blue-600',
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
              },
              {
                to: '/admin/tags', label: '管理标签', desc: '添加或编辑分类标签',
                cls: 'bg-purple-50 text-purple-600',
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>,
              },
              {
                to: '/admin/users', label: '用户管理', desc: '管理注册用户和权限',
                cls: 'bg-emerald-50 text-emerald-600',
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
              },
              {
                to: '/profile', label: '个人信息', desc: '修改昵称、头像和密码',
                cls: 'bg-rose-50 text-rose-600',
                icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
              },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.cls}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
