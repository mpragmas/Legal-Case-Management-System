import { useApp } from "../context/AppContext";
import { CheckCircle, AlertTriangle, Info, XCircle, X } from "lucide-react";

export function ToastContainer() {
  const { toasts } = useApp();

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-500" />,
    warning: <AlertTriangle size={18} className="text-amber-500" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200",
    warning: "bg-amber-50 border-amber-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-in ${
            bgColors[t.type] || bgColors.success
          }`}
        >
          {icons[t.type] || icons.success}
          <span className="text-sm font-medium text-surface-800">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
