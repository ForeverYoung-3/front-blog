import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', nickname: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = await authApi.register(form);
      login(auth);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">注册账号</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名 *</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
              placeholder="3-50 个字符"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
            <input
              type="text"
              value={form.nickname}
              onChange={e => setForm({ ...form, nickname: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
              placeholder="显示名称（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码 *</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
              placeholder="至少 6 个字符"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          已有账号？
          <Link to="/login" className="text-indigo-600 hover:underline ml-1">立即登录</Link>
        </p>
      </div>
    </div>
  );
}
