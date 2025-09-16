// src/pages/admin/AdminAssessments.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import apiFetch from "../../api/apiClient";
import Toast from "../../components/Toast";

// Fallback labels
const DEFAULT_LABELS = {
  initial: "Initial Assessment",
  diy: "DIY & Repairs",
  technology: "Technology & Digital Skills",
  "self-care": "Well-being & Self-care",
  communication: "Communication & Relationships",
  community: "Community & Contribution",
};

export default function AdminAssessments() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(`/api/admin/assessment/categories`);
        setRows(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load categories", err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Collapse duplicates, pin "initial" on top
  const assessments = useMemo(() => {
    const byType = new Map();

    for (const r of rows) {
      const t = (r.assessment_type || "").trim();
      const c = (r.category || "").trim();
      if (!t) continue;
      if (!byType.has(t)) byType.set(t, []);
      if (c) byType.get(t).push(c);
    }

    const pickLabel = (type, cats) => {
      if (type === "initial") return DEFAULT_LABELS.initial;
      if (cats.length === 0) return DEFAULT_LABELS[type] || type;

      // mode by case-insensitive string
      const count = new Map();
      for (const cat of cats) {
        const norm = cat.toLowerCase().trim();
        if (!count.has(norm)) count.set(norm, { n: 0, display: cat });
        count.get(norm).n += 1;
      }
      let best = null;
      for (const info of count.values()) {
        if (!best || info.n > best.n) best = info;
      }
      return best?.display ?? DEFAULT_LABELS[type] ?? type;
    };

    const list = [];
    for (const [type, cats] of byType.entries()) {
      list.push({ type, label: pickLabel(type, cats) });
    }

    list.sort((a, b) => {
      if (a.type === "initial") return -1;
      if (b.type === "initial") return 1;
      return a.label.localeCompare(b.label);
    });

    return list;
  }, [rows]);

  const handleRestoreDefaults = () => {
    setToast({
      message: "This will wipe ALL assessments and restore defaults. Continue?",
      onConfirm: async () => {
        try {
          await apiFetch(`/api/admin/assessment/restore-defaults`, {
            method: "POST",
          });
          setToast({
            message: "Defaults restored ✅",
            onConfirm: () => window.location.reload(),
            onCancel: () => setToast(null),
          });
        } catch (e) {
          console.error("Restore failed", e);
          setToast({
            message: "Failed to restore defaults ❌",
            onConfirm: () => setToast(null),
            onCancel: () => setToast(null),
          });
        }
      },
      onCancel: () => setToast(null),
    });
  };

  if (loading) return <p className="text-white">Loading assessments...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Manage Assessments</h1>

      <div className="bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Assessments</h2>
          <button
            onClick={() => navigate(`/admin/assessments/new`)}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold"
          >
            + New Assessment
          </button>
        </div>

        <ul className="space-y-2">
          {assessments.map((a) => (
            <li
              key={a.type}
              className="p-3 rounded-lg cursor-pointer bg-neutral-700 hover:bg-brand-600 hover:text-white transition"
              onClick={() => navigate(`/admin/assessments/${a.type}`)}
            >
              {a.label}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleRestoreDefaults}
        className="px-5 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-semibold shadow"
      >
        Restore Defaults
      </button>

      {toast && (
        <Toast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </div>
  );
}
