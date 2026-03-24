import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toastStore, Toast } from "./toastStore";
import ToastItem from "./ToastItem";

export const ToastProvider = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toastStore.subscribe(setToasts);
  }, []);

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>,
    document.body,
  );
};
