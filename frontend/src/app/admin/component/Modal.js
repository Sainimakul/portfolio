// components/Modal.js
import { useEffect } from "react";

export function Modal({ title, onClose, children, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95%] lg:max-w-6xl",
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
    >
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @media (min-width: 640px) {
          .animate-slide-up {
            animation: fade-in 0.2s ease-out;
          }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full ${sizeClasses[size]} 
          bg-white rounded-t-2xl sm:rounded-xl 
          border border-gray-200
          shadow-xl
          animate-slide-up
          max-h-[90vh] flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                     bg-gray-100 hover:bg-gray-200 
                     text-gray-500 hover:text-gray-700
                     transition-all"
          >
            <span className="material-icons text-lg">close</span>
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Confirmation Modal
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}) {
  if (!isOpen) return null;

  const variantClasses = {
    danger: {
      button: "bg-red-600 hover:bg-red-700",
      icon: "text-red-500",
      bg: "bg-red-100"
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700",
      icon: "text-yellow-500",
      bg: "bg-yellow-100"
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700",
      icon: "text-blue-500",
      bg: "bg-blue-100"
    }
  };

  const variantIcons = {
    danger: "warning",
    warning: "info",
    info: "info"
  };

  return (
    <Modal title={title} onClose={onClose} size="sm">
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`w-16 h-16 rounded-full ${variantClasses[variant].bg} flex items-center justify-center`}>
            <span className={`material-icons text-4xl ${variantClasses[variant].icon}`}>
              {variantIcons[variant]}
            </span>
          </div>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${variantClasses[variant].button}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
}