// src/pages/admin/AdminAssessments.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import apiFetch from "../../api/apiClient";
import Toast from "../../components/Toast";
import { Trash2 } from "lucide-react";

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

  // fetch all categories/types
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

  // group by assessment_type
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

      const counts = new Map();
      for (const cat of cats) {
        const norm = cat.toLowerCase();
        if (!counts.has(norm)) counts.set(norm, { n: 0, display: cat });
        counts.get(norm).n++;
      }
      let best = null;
      for (const val of counts.values()) {
        if (!best || val.n > best.n) best = val;
      }
      return best?.display ?? type;
    };

    const list = [];
    for (const [type, cats] of byType.entries()) {
      list.push({ type, label: pickLabel(type, cats) });
    }

    // sort: initial always first, others alphabetically
    list.sort((a, b) => {
      if (a.type === "initial") return -1;
      if (b.type === "initial") return 1;
      return a.label.localeCompare(b.label);
    });

    return list;
  }, [rows]);

  // create new assessment
  const handleCreateAssessment = async () => {
    const category = prompt("Enter a name for the new assessment category:");
    if (!category) return;

    const type = category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      await apiFetch(`/api/admin/assessment/questions`, {
        method: "POST",
        body: JSON.stringify({
          assessment_type: type,
          category,
          text: "New question...",
          parent_id: null,
        }),
      });
      navigate(`/admin/assessments/${type}`);
    } catch (err) {
      console.error("Failed to create assessment", err);
      alert("Could not create new assessment ❌");
    }
  };

  // delete assessment
  const handleDeleteAssessment = (type, label) => {
    setToast({
      message: `Delete the entire assessment "${label}"? This will remove all its questions.`,
      onConfirm: async () => {
        try {
          await apiFetch(`/api/admin/assessment/delete-type/${type}`, {
            method: "DELETE",
          });
          setToast(null);
          setRows((prev) => prev.filter((r) => r.assessment_type !== type));
        } catch (err) {
          console.error("Failed to delete assessment", err);
          setToast(null);
          alert("Failed to delete assessment ❌");
        }
      },
      onCancel: () => setToast(null),
    });
  };

  // restore defaults
  const handleRestoreDefaults = () => {
    setToast({
      message: "This will wipe ALL assessments and restore defaults. Continue?",
      onConfirm: async () => {
        try {
          await apiFetch(`/api/admin/assessment/restore-defaults`, {
            method: "POST",
          });
          setToast(null);
          window.location.reload();
        } catch (err) {
          console.error("Restore failed", err);
          setToast(null);
          alert("Failed to restore defaults ❌");
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
            onClick={handleCreateAssessment}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold"
          >
            + New Assessment
          </button>
        </div>

        <ul className="space-y-2">
          {assessments.map((a) => (
            <li
              key={a.type}
              className="p-3 rounded-lg bg-neutral-700 flex justify-between items-center"
            >
              <span
                className="flex-1 cursor-pointer hover:text-brand-400"
                onClick={() => navigate(`/admin/assessments/${a.type}`)}
              >
                {a.label}
              </span>
              {a.type !== "initial" && (
                <button
                  onClick={() => handleDeleteAssessment(a.type, a.label)}
                  className="p-1 hover:bg-red-600 rounded"
                  title="Delete assessment"
                >
                  <Trash2 size={18} />
                </button>
              )}
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
