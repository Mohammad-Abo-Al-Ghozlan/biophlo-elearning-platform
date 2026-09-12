import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X, type LucideIcon } from "lucide-react";
import type { ToastMessage } from "../../types";
import { ToastContext, type ToastInput } from "./toast-context";

const toneIcons: Record<NonNullable<ToastMessage["tone"]>, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  danger: AlertCircle,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: number) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const notify = useCallback(
    (message: ToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setMessages((current) => [...current.slice(-3), { ...message, id }]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section className="toast-stack" aria-label="Notifications" aria-live="polite">
        {messages.map((message) => {
          const Icon = toneIcons[message.tone ?? "info"];
          return (
            <div className={`toast toast-${message.tone ?? "info"}`} key={message.id}>
              <Icon aria-hidden="true" size={20} />
              <div>
                <strong>{message.title}</strong>
                {message.detail ? <span>{message.detail}</span> : null}
              </div>
              <button type="button" onClick={() => dismiss(message.id)} aria-label="Dismiss notification">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </section>
    </ToastContext.Provider>
  );
}
