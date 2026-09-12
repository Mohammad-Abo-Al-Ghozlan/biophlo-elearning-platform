import { createContext, useContext } from "react";
import type { ToastMessage } from "../../types";

export type ToastInput = Omit<ToastMessage, "id">;

interface ToastContextValue {
  notify: (message: ToastInput) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
