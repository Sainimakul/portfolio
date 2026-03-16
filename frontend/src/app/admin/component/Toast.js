// components/Toast.js
import React, { useState, useEffect } from "react";

export const toast = {
  show: (message, type = "success") => {
    const event = new CustomEvent("toast", { detail: { message, type } });
    window.dispatchEvent(event);
  },
  error: (message) => toast.show(message, "error"),
  success: (message) => toast.show(message, "success"),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now();

      setToasts((prev) => [...prev, { id, ...e.detail }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white min-w-[220px] transition-all
          ${t.type === "success" ? "bg-green-500" : ""}
          ${t.type === "error" ? "bg-red-500" : ""}
          ${t.type === "warning" ? "bg-yellow-500 text-black" : ""}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}