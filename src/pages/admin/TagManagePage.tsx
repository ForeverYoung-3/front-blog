import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsApi } from '../../api/tags';
import type { Tag } from '../../types';

const PRESET_COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function TagManagePage() {
  const queryClient = useQueryClient();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', color: '#6366f1', description: '' });
  const [showForm, setShowForm] = useState(false);

  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof form }) => tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tagsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
  });

  const resetForm = () => {
    setForm({ name: '', slug: '', color: '#6366f1', description: '' });
    setEditingTag(null);
    setShowForm(false);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setForm({ name: tag.name, slug: tag.slug, color: tag.color, description: tag.description || '' });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (tag: Tag) => {
    if (window.confirm(`确定要删除标签「${tag.name}」吗？`)) {
      deleteMutation.mutate(tag.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">标签管理</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          + 新建标签
        </button>
      </div>

      {/* 新建/编辑表单 */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="font-medium text-gray-800 mb-4">{editingTag ? '编辑标签' : '新建标签'}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">标签名 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Slug（URL 别名）</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value })}
                  placeholder="留空自动生成"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">颜色</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
                <div className="flex gap-1">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: c, borderColor: form.color === c ? '#1e293b' : 'transparent' }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{form.color}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">描述</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                placeholder="可选"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {editingTag ? '保存修改' : '创建标签'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 标签列表 */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tags?.map(tag => (
            <div key={tag.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="font-medium text-gray-800">{tag.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(tag)} className="text-xs text-indigo-600 hover:text-indigo-800">编辑</button>
                  <button onClick={() => handleDelete(tag)} className="text-xs text-red-500 hover:text-red-700">删除</button>
                </div>
              </div>
              <p className="text-xs text-gray-400">slug: {tag.slug}</p>
              <p className="text-xs text-gray-400">{tag.postCount} 篇文章</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
