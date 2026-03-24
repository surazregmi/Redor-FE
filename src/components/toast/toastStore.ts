type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];

const notify = () => {
  listeners.forEach((l) => l(toasts));
};

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.push(listener);
    listener(toasts);

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  add(message: string, type: ToastType = "info") {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type }];
    notify();

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  },

  remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};