import { useRef, useState } from 'react';
import { uploadImage } from '../../api/upload';

interface ImageUploadProps {
  /** 当前图片 URL（用于预览） */
  value?: string;
  /** 上传成功后回调，返回新 URL */
  onChange: (url: string) => void;
  /** 预览形状：circle = 圆形头像，rect = 矩形封面 */
  shape?: 'circle' | 'rect';
  /** rect 模式下提示文字 */
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  shape = 'rect',
  placeholder = '点击上传封面图',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('图片不能超过 5MB');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ===== 圆形头像模式 =====
  if (shape === 'circle') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-20 h-20 rounded-full cursor-pointer group"
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <img src={value} alt="avatar" className="w-full h-full rounded-full object-cover ring-4 ring-indigo-100" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center ring-4 ring-gray-100">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          {/* 悬停蒙层 */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100
                          transition-opacity flex items-center justify-center">
            {uploading ? (
              <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    );
  }

  // ===== 矩形封面模式 =====
  return (
    <div className="space-y-1.5">
      <div
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
          hover:border-indigo-400 hover:bg-indigo-50/30
          ${value ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}
        style={{ minHeight: '120px' }}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {value ? (
          <div className="relative group">
            <img src={value} alt="cover" className="w-full h-40 object-cover rounded-xl" />
            <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100
                            transition-opacity flex items-center justify-center gap-2">
              {uploading ? (
                <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white text-sm font-medium">更换封面</span>
                </>
              )}
            </div>
            {/* 删除按钮 */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(''); }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500 rounded-full
                         flex items-center justify-center transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {uploading ? (
              <>
                <svg className="w-8 h-8 text-indigo-400 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm text-indigo-400">上传中...</p>
              </>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-400">{placeholder}</p>
                <p className="text-xs text-gray-300 mt-1">支持拖拽，JPG / PNG / WebP，最大 5MB</p>
              </>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
}
