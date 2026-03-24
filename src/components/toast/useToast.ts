import { toastStore } from "./toastStore";

export const toast = {
  success: (msg: string) => toastStore.add(msg, "success"),
  error: (msg: string) => toastStore.add(msg, "error"),
  info: (msg: string) => toastStore.add(msg, "info"),
  warning: (msg: string) => toastStore.add(msg, "warning"),
};