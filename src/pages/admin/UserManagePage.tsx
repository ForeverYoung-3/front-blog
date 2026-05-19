import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api/admin';
import type { Role, User } from '../../types';

const ROLE_COLORS: Record<Role, string> = {
  ROLE_ADMIN: 'bg-red-100 text-red-700',
  ROLE_EDITOR: 'bg-blue-100 text-blue-700',
  ROLE_VIEWER: 'bg-gray-100 text-gray-600',
};

export default function UserManagePage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => adminApi.updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const handleRoleChange = (user: User, role: Role) => {
    updateMutation.mutate({ id: user.id, data: { role } });
  };

  const handleToggleEnabled = (user: User) => {
    updateMutation.mutate({ id: user.id, data: { enabled: !user.enabled } });
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`确定要删除用户「${user.username}」吗？此操作不可恢复。`)) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">用户管理</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">用户</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">邮箱</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">角色</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">文章数</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">状态</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">注册时间</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users?.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {user.nickname?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{user.nickname}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user, e.target.value as Role)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${ROLE_COLORS[user.role]}`}
                    >
                      <option value="ROLE_ADMIN">管理员</option>
                      <option value="ROLE_EDITOR">编辑</option>
                      <option value="ROLE_VIEWER">访客</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.postCount}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleEnabled(user)}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        user.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {user.enabled ? '正常' : '已禁用'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
