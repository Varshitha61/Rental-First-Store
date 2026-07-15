import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Dismiss toast automatically after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}

      {/* Toasts Floating list Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = "bg-neutral-900 border-neutral-800 text-neutral-200";
          let icon = <Info className="w-5 h-5 text-sky-400" />;

          if (toast.type === "success") {
            bgColor = "bg-neutral-900 border-emerald-500/20 text-emerald-300";
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
          } else if (toast.type === "error") {
            bgColor = "bg-neutral-900 border-red-500/20 text-red-300";
            icon = <AlertTriangle className="w-5 h-5 text-red-400" />;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start justify-between gap-3 p-4 border rounded-2xl shadow-2xl backdrop-blur-md animate-slide-in pointer-events-auto ${bgColor}`}
            >
              <div className="flex gap-3 items-center">
                {icon}
                <span className="text-xs font-semibold leading-relaxed select-none">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-500 hover:text-neutral-300 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
