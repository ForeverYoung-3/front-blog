import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { usersApi } from '../../api/users';
import ImageUpload from '../../components/common/ImageUpload';

type Tab = 'info' | 'password';

export default function ProfilePage() {
  const { user, login } = useAuthStore();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>('info');

  // 从后端拉取完整用户信息（含 bio、email 等 store 里没有的字段）
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['users-me'],
    queryFn: usersApi.getMe,
  });

  // 基本信息表单
  const [infoForm, setInfoForm] = useState({
    nickname: user?.nickname || '',
    avatar: user?.avatar || '',
    bio: '',
    email: '',
  });

  // 接口数据回来后同步填入表单
  useEffect(() => {
    if (profile) {
      setInfoForm({
        nickname: profile.nickname || '',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        email: profile.email || '',
      });
    }
  }, [profile]);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // 修改密码表单
  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoMsg(null);
    try {
      const res = await usersApi.updateMe({
        nickname: infoForm.nickname,
        avatar: infoForm.avatar || undefined,
        bio: infoForm.bio,
        email: infoForm.email || undefined,
      });
      // 同步更新表单数据（防止再次保存时数据不一致）
      setInfoForm({
        nickname: res.nickname || '',
        avatar: res.avatar || '',
        bio: res.bio || '',
        email: res.email || '',
      });
      // 更新本地 store（nickname、avatar 会显示在导航栏）
      if (user) {
        login({
          accessToken: useAuthStore.getState().token!,
          tokenType: 'Bearer',
          userId: user.id,
          username: user.username,
          nickname: res.nickname,
          avatar: res.avatar,
          role: user.role,
        });
      }
      // 刷新 React Query 缓存，确保下次进入页面数据是最新的
      queryClient.setQueryData(['users-me'], res);
      setInfoMsg({ type: 'ok', text: '保存成功！' });
    } catch (err: unknown) {
      setInfoMsg({ type: 'err', text: err instanceof Error ? err.message : '保存失败' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'err', text: '两次输入的新密码不一致' });
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdMsg({ type: 'err', text: '新密码至少 6 位' });
      return;
    }
    setPwdLoading(true);
    try {
      await usersApi.changePassword({
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdMsg({ type: 'ok', text: '密码修改成功！' });
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      setPwdMsg({ type: 'err', text: err instanceof Error ? err.message : '修改失败，请检查原密码是否正确' });
    } finally {
      setPwdLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-xl mx-auto animate-pulse space-y-4">
        <div className="h-7 bg-gray-200 rounded w-32" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-10 bg-gray-100 rounded-xl w-48" />
        <div className="h-56 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-0 sm:px-0">
      <h2 className="text-xl font-bold text-gray-800 mb-6">个人信息</h2>

      {/* 头像预览卡片 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 text-center sm:text-left">
        <div className="flex-shrink-0">
          <ImageUpload
            value={infoForm.avatar || undefined}
            onChange={url => setInfoForm(prev => ({ ...prev, avatar: url }))}
            shape="circle"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user?.nickname}</p>
          <p className="text-sm text-gray-400">{user?.username}</p>
          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
            user?.role === 'ROLE_ADMIN'
              ? 'bg-red-100 text-red-600'
              : user?.role === 'ROLE_EDITOR'
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {user?.role === 'ROLE_ADMIN' ? '管理员' : user?.role === 'ROLE_EDITOR' ? '编辑' : '访客'}
          </span>
          <p className="text-xs text-gray-400 mt-1">点击头像可直接更换</p>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-full sm:w-fit">
        {([['info', '基本信息'], ['password', '修改密码']] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 sm:flex-none px-5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === key
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 基本信息 */}
      {tab === 'info' && (
        <form onSubmit={handleInfoSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
            <input
              type="text"
              value={infoForm.nickname}
              onChange={e => setInfoForm({ ...infoForm, nickname: e.target.value })}
              placeholder="你的昵称"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
            <input
              type="email"
              value={infoForm.email}
              onChange={e => setInfoForm({ ...infoForm, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="flex items-center gap-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-indigo-600">头像可在上方卡片处点击直接上传替换</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">个人简介</label>
            <textarea
              value={infoForm.bio}
              onChange={e => setInfoForm({ ...infoForm, bio: e.target.value })}
              placeholder="介绍一下自己..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition resize-none"
            />
          </div>

          {infoMsg && (
            <div className={`text-sm px-4 py-2.5 rounded-xl ${
              infoMsg.type === 'ok'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {infoMsg.type === 'ok' ? '✓ ' : '✕ '}{infoMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={infoLoading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium
                       hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {infoLoading ? '保存中...' : '保存修改'}
          </button>
        </form>
      )}

      {/* 修改密码 */}
      {tab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">当前密码</label>
            <input
              type="password"
              value={pwdForm.oldPassword}
              onChange={e => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
              placeholder="输入当前密码"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">新密码</label>
            <input
              type="password"
              value={pwdForm.newPassword}
              onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
              placeholder="至少 6 位"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">确认新密码</label>
            <input
              type="password"
              value={pwdForm.confirmPassword}
              onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
              placeholder="再输入一次新密码"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {pwdMsg && (
            <div className={`text-sm px-4 py-2.5 rounded-xl ${
              pwdMsg.type === 'ok'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {pwdMsg.type === 'ok' ? '✓ ' : '✕ '}{pwdMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium
                       hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {pwdLoading ? '修改中...' : '确认修改'}
          </button>
        </form>
      )}
    </div>
  );
}
