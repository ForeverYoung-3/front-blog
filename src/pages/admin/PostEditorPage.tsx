import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Editor } from '@bytemd/react';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import mermaid from '@bytemd/plugin-mermaid';
import zhHans from 'bytemd/locales/zh_Hans.json';
import 'bytemd/dist/index.css';
import 'highlight.js/styles/github.css';
import { postsApi } from '../../api/posts';
import { tagsApi } from '../../api/tags';
import { uploadImage } from '../../api/upload';
import ImageUpload from '../../components/common/ImageUpload';
import type { PostRequest, PostStatus } from '../../types';

const plugins = [
  gfm(),
  highlight(),
  mermaid(),
];

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<PostRequest>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    coverImage: '',
    status: 'DRAFT',
    pinned: false,
    tagIds: [],
  });

  const { data: post } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: () => postsApi.getById(Number(id)),
    enabled: isEdit,
  });

  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        summary: post.summary || '',
        content: post.content || '',
        coverImage: post.coverImage || '',
        status: post.status,
        pinned: post.pinned,
        tagIds: post.tags.map(t => t.id),
      });
    }
  }, [post]);

  const createMutation = useMutation({
    mutationFn: (data: PostRequest) => postsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/admin/posts');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PostRequest) => postsApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/admin/posts');
    },
  });

  const handleSubmit = (status: PostStatus) => {
    const data = { ...form, status };
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const toggleTag = (tagId: number) => {
    setForm(prev => ({
      ...prev,
      tagIds: prev.tagIds?.includes(tagId)
        ? prev.tagIds.filter(i => i !== tagId)
        : [...(prev.tagIds || []), tagId],
    }));
  };

  /** ByteMD 编辑器内粘贴/拖入图片时自动上传 */
  const handleUploadImages = async (files: File[]) => {
    const results = await Promise.all(
      files.map(async file => {
        try {
          const url = await uploadImage(file);
          return { url, alt: file.name, title: file.name };
        } catch {
          return { url: '', alt: file.name, title: file.name };
        }
      })
    );
    return results;
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <div className="max-w-5xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEdit ? '编辑文章' : '写新文章'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
          {error.message}
        </div>
      )}

      <div className="space-y-4">
        {/* 标题 */}
        <input
          type="text"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="文章标题..."
          className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 focus:border-indigo-400 focus:outline-none py-2 bg-transparent"
        />

        {/* 摘要 */}
        <textarea
          value={form.summary}
          onChange={e => setForm({ ...form, summary: e.target.value })}
          placeholder="文章摘要（可选，不填则自动截取内容）"
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
        />

        {/* ByteMD 编辑器：uploadImages 回调自动把粘贴/拖入的图片上传 */}
        <div className="bytemd-wrapper">
          <Editor
            value={form.content}
            plugins={plugins}
            locale={zhHans}
            onChange={val => setForm({ ...form, content: val })}
            uploadImages={handleUploadImages}
          />
        </div>

        {/* 标签选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">选择标签</label>
          <div className="flex flex-wrap gap-2">
            {tags?.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`text-xs px-3 py-1.5 rounded-full border-2 transition-all ${
                  form.tagIds?.includes(tag.id)
                    ? 'text-white border-transparent'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
                style={form.tagIds?.includes(tag.id) ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* 封面图 + 其他设置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          {/* 封面图上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">封面图</label>
            <ImageUpload
              value={form.coverImage}
              onChange={url => setForm({ ...form, coverImage: url })}
              shape="rect"
              placeholder="点击上传封面图（或拖拽）"
            />
          </div>

          {/* 其他选项 */}
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.pinned}
                onClick={() => setForm({ ...form, pinned: !form.pinned })}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  form.pinned ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.pinned ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
              <label className="text-sm text-gray-700 cursor-pointer select-none"
                     onClick={() => setForm({ ...form, pinned: !form.pinned })}>
                置顶文章
              </label>
            </div>
            <p className="text-xs text-gray-400">封面图支持直接粘贴或拖拽上传。编辑器内的图片同样支持拖拽/粘贴上传。</p>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSubmit('DRAFT')}
            disabled={isPending || !form.title || !form.content}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            保存草稿
          </button>
          <button
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={isPending || !form.title || !form.content}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? '保存中...' : '发布文章'}
          </button>
          <button
            onClick={() => navigate('/admin/posts')}
            className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
