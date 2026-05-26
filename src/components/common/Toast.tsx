/**
 * 极简全局 Toast 系统
 * - 通过 toast.error / toast.success / toast.info 触发
 * - 在 App.tsx 挂载 <ToastContainer />
 */

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

// ---- 事件总线（不依赖 React context，request.ts 里也能直接调用）----
type Listener = (item: ToastItem) => void;
let _listener: Listener | null = null;
let _idCounter = 0;

export const toast = {
  success: (message: string) => _emit('success', message),
  error:   (message: string) => _emit('error',   message),
  info:    (message: string) => _emit('info',     message),
};

function _emit(type: ToastType, message: string) {
  const item: ToastItem = { id: ++_idCounter, type, message };
  _listener?.(item);
}

// ---- React 组件 ----
import { useState, useEffect } from 'react';

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_STYLES: Record<ToastType, string> = {
  success: 'bg-green-100 text-green-600',
  error:   'bg-red-100 text-red-600',
  info:    'bg-blue-100 text-blue-600',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    _listener = (item) => {
      setToasts(prev => [...prev, item]);
      // 4 秒后自动消失
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== item.id));
      }, 4000);
    };
    return () => { _listener = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
                      max-w-sm w-full pointer-events-auto
                      animate-[slideIn_0.2s_ease-out]
                      ${STYLES[t.type]}`}
        >
          <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold
                            flex items-center justify-center mt-0.5 ${ICON_STYLES[t.type]}`}>
            {ICONS[t.type]}
          </span>
          <p className="text-sm leading-snug flex-1">{t.message}</p>
          <button
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="flex-shrink-0 text-current opacity-40 hover:opacity-70 transition-opacity text-base leading-none mt-0.5"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
