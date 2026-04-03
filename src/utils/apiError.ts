import { isAxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    console.log("from axios",error)
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message.trim();
    }
  }
  return fallback;
}
