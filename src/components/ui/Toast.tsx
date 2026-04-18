import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';
import { TOAST_DURATION_MS } from '@/lib/constants';
import type { ToastItem, ToastVariant } from '@/types';

interface ToastContextValue {
  toast: (opts: { variant: ToastVariant; title: string; description?: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; className: string }
> = {
  success: {
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    className: 'border-green-200 bg-green-50',
  },
  error: {
    icon: <XCircle className="h-4 w-4 text-red-600" />,
    className: 'border-red-200 bg-red-50',
  },
  info: {
    icon: <Info className="h-4 w-4 text-blue-600" />,
    className: 'border-blue-200 bg-blue-50',
  },
};

function ToastItem({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const config = variantConfig[item.variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const duration = item.duration ?? TOAST_DURATION_MS;
    timerRef.current = setTimeout(() => onDismiss(item.id), duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [item.id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-3 shadow-md animate-slide-up',
        'w-80 pointer-events-auto',
        config.className,
      )}
    >
      <span className="mt-0.5 shrink-0">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900">{item.title}</p>
        {item.description && (
          <p className="mt-0.5 text-xs text-neutral-600">{item.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded p-0.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      variant,
      title,
      description,
      duration,
    }: {
      variant: ToastVariant;
      title: string;
      description?: string;
      duration?: number;
    }) => {
      const id = generateId();
      const item: ToastItem = { id, variant, title, ...(description !== undefined ? { description } : {}), ...(duration !== undefined ? { duration } : {}) };
      setToasts((prev) => [...prev, item]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div
          className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
          aria-label="Notifications"
        >
          {toasts.map((item) => (
            <ToastItem key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
