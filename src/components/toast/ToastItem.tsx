import { Toast, toastStore } from "./toastStore";
import Alert from "@/components/ui/alert/Alert";

const ToastItem = ({ toast }: { toast: Toast }) => {
  return (
    <div
      className="w-[320px] transform transition-all duration-300 ease-out"
      style={{
        animation: "slideIn 0.25s ease, fadeOut 0.25s ease 2.75s forwards",
      }}
    >
      <div className="relative">
        <Alert
          variant={toast.type}
          title={
            toast.type === "success"
              ? "Success"
              : toast.type === "error"
                ? "Error"
                : toast.type === "warning"
                  ? "Warning"
                  : "Info"
          }
          message={toast.message}
        />

        {/* Close button overlay */}
        <button
          onClick={() => toastStore.remove(toast.id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ToastItem;
