import { useEffect } from "react";

export default function Toast({ message, onConfirm, onCancel }) {
  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div className="fixed bottom-6 right-6 bg-neutral-900 text-white px-6 py-4 rounded-xl shadow-lg border border-neutral-700 w-80 z-50 animate-fade-in">
      <p className="mb-4 text-sm">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-1 rounded bg-brand-600 hover:bg-brand-500 text-sm font-semibold"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
