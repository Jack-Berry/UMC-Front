// src/components/SkillDetailModal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function SkillDetailModal({ skill, onClose }) {
  if (!skill) return null;

  // 🔹 Close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose} // backdrop closes
    >
      <div
        className="bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // prevent accidental close inside
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          {skill.tag} — {skill.score}/100
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Based on your answers to related questions:
        </p>

        {skill.evidence?.length > 0 ? (
          <ul className="space-y-3">
            {skill.evidence.map((e, idx) => (
              <li key={idx} className="bg-neutral-800 rounded-md p-3">
                <p className="text-gray-200 text-sm">{e.question}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Your answer: {e.answer}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">No evidence found.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
