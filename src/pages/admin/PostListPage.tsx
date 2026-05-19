import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../../api/posts';
import { adminApi } from '../../api/admin';
import { useAuthStore } from '../../store/authStore';
import type { PostStatus } from '../../types';

const STATUS_LABELS: Record<PostStatus, { label: string; color: string }> = {
  DRAFT: { label: '草稿', color: 'bg-yellow-100 text-yellow-700' },
  PUBLISHED: { label: '已发布', color: 'bg-green-100 text-green-700' },
  ARCHIVED: { label: '已归档', color: 'bg-gray-100 text-gray-600' },
};

export default function PostListPage() {
  const [statusFilter, setStatusFilter] = useState<PostStatus | undefined>();
  const [page, setPage] = useState(0);
  const { isAdmin } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['admin-posts', statusFilter, page],
    queryFn: () => isAdmin()
      ? adminApi.getAllPosts(statusFilter, page, 15)
      : postsApi.getMyPosts(statusFilter, page, 15),
  });

  const deleteMutation = useMutation({
    mutationFn: postsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const publishMutation = useMutation({
    mutationFn: postsApi.publish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`确定要删除文章「${title}」吗？`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">文章管理</h2>
        <Link
          to="/admin/posts/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          ✏️ 写文章
        </Link>
      </div>

      {/* 状态筛选 */}
      <div className="flex gap-2 mb-4">
        {([undefined, 'DRAFT', 'PUBLISHED', 'ARCHIVED'] as (PostStatus | undefined)[]).map(s => (
          <button
            key={s ?? 'all'}
            onClick={() => { setStatusFilter(s); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              statusFilter === s
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s ? STATUS_LABELS[s].label : '全部'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : postsData?.content.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📭</p>
          <p>暂无文章</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">标题</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">状态</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">标签</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">浏览</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">时间</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {postsData?.content.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.pinned && <span className="text-indigo-500">📌</span>}
                      <Link
                        to={`/post/${post.slug}`}
                        target="_blank"
                        className="text-gray-800 hover:text-indigo-600 font-medium line-clamp-1 max-w-xs"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_LABELS[post.status].color}`}>
                      {STATUS_LABELS[post.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag.id}
                          className="text-xs px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{post.viewCount}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs"
                      >
                        编辑
                      </Link>
                      {post.status === 'DRAFT' && (
                        <button
                          onClick={() => publishMutation.mutate(post.id)}
                          className="text-green-600 hover:text-green-800 text-xs"
                        >
                          发布
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 分页 */}
      {postsData && postsData.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: postsData.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1.5 rounded text-sm border ${
                i === page ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
