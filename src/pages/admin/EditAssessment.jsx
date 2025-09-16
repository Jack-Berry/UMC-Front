// src/pages/admin/EditAssessment.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../../api/apiClient";
import { formatAssessmentQuestions } from "../../utils/formatAssessment";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "../../components/SortableItem";
import { Pencil, Trash2, Plus, ChevronRight } from "lucide-react";
import Toast from "../../components/Toast";

const TYPE_TO_CATEGORY = {
  initial: "Initial Assessment",
  diy: "DIY & Repairs",
  technology: "Technology & Digital Skills",
  "self-care": "Well-being & Self-care",
  communication: "Communication & Relationships",
  community: "Community & Contribution",
};

export default function EditAssessment() {
  const { type, parentId } = useParams();
  const navigate = useNavigate();

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [dirty, setDirty] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState(
    TYPE_TO_CATEGORY[type] || type
  );

  // 🔹 Toast state
  const [toast, setToast] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  // Load questions
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (parentId) {
          const [children, parent] = await Promise.all([
            apiFetch(`/api/admin/assessment/questions?parent_id=${parentId}`),
            apiFetch(`/api/admin/assessment/questions/${parentId}`).catch(
              () => null
            ),
          ]);

          if (!cancelled) {
            const label = parent?.category || TYPE_TO_CATEGORY[type] || type;
            setCategoryLabel(label);
            setBlocks([
              {
                category: label,
                title: label,
                questions: children || [],
              },
            ]);
          }
        } else {
          const res = await apiFetch(
            `/api/admin/assessment/questions?type=${type}`
          );
          if (!cancelled) {
            setCategoryLabel(TYPE_TO_CATEGORY[type] || type);
            setBlocks(formatAssessmentQuestions(res));
          }
        }
      } catch (e) {
        console.error("Failed to load assessment", e);
        if (!cancelled) setBlocks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type, parentId]);

  // Reorder
  const handleReorder = (event, catIndex) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const next = [...prev];
      const cat = next[catIndex];
      const oldIdx = cat.questions.findIndex((q) => q.id === active.id);
      const newIdx = cat.questions.findIndex((q) => q.id === over.id);
      cat.questions = arrayMove(cat.questions, oldIdx, newIdx);
      return next;
    });
    setDirty(true);
  };

  // Start editing
  const handleEditStart = (q) => {
    setEditingId(q.id);
    setEditingText(q.text || "");
  };

  // Commit edit
  const handleEditCommit = (cat) => {
    const id = editingId;
    const value = editingText.trim();
    setEditingId(null);
    if (!id || !value) return;
    setBlocks((prev) =>
      prev.map((c) =>
        c.category === cat.category
          ? {
              ...c,
              questions: c.questions.map((q) =>
                q.id === id ? { ...q, text: value } : q
              ),
            }
          : c
      )
    );
    setDirty(true);
  };

  // Delete with confirm toast
  const handleDelete = (qId, catIndex) => {
    setToast({
      message: "Delete this question (and any follow-ups)?",
      onConfirm: async () => {
        try {
          await apiFetch(`/api/admin/assessment/questions/${qId}`, {
            method: "DELETE",
          });
          setBlocks((prev) =>
            prev.map((cat, idx) =>
              idx === catIndex
                ? {
                    ...cat,
                    questions: cat.questions.filter((q) => q.id !== qId),
                  }
                : cat
            )
          );
          setToast({
            message: "Question deleted ✅",
            onConfirm: () => setToast(null),
            onCancel: () => setToast(null),
          });
        } catch (e) {
          console.error("Failed to delete question", e);
          setToast({
            message: "Failed to delete question ❌",
            onConfirm: () => setToast(null),
            onCancel: () => setToast(null),
          });
        }
      },
      onCancel: () => setToast(null),
    });
  };

  // Add question
  const handleAddQuestion = async (catIndex) => {
    try {
      const cat = blocks[catIndex];
      const created = await apiFetch(`/api/admin/assessment/questions`, {
        method: "POST",
        body: JSON.stringify({
          assessment_type: type,
          category: cat.category || categoryLabel,
          text: "New question...",
          parent_id: parentId || null,
        }),
      });
      setBlocks((prev) =>
        prev.map((c, idx) =>
          idx === catIndex
            ? { ...c, questions: [...c.questions, { ...created }] }
            : c
        )
      );
      setEditingId(created.id);
      setEditingText(created.text);
    } catch (e) {
      console.error("Failed to add question", e);
      setToast({
        message: "Could not add question ❌",
        onConfirm: () => setToast(null),
        onCancel: () => setToast(null),
      });
    }
  };

  // Save all
  const handleSaveAll = async () => {
    const payload = blocks.flatMap((cat) =>
      cat.questions.map((q, idx) => ({
        id: q.id,
        text: q.text,
        category: cat.category || categoryLabel,
        parent_id: parentId || null,
        sort_order: idx,
      }))
    );

    try {
      await apiFetch(`/api/admin/assessment/questions/bulk`, {
        method: "PATCH",
        body: JSON.stringify({ questions: payload }),
      });
      setDirty(false);
      setToast({
        message: "All changes saved ✅",
        onConfirm: () => setToast(null),
        onCancel: () => setToast(null),
      });
    } catch (e) {
      console.error("Bulk save failed", e);
      setToast({
        message: "Failed to save changes ❌",
        onConfirm: () => setToast(null),
        onCancel: () => setToast(null),
      });
    }
  };

  if (loading) return <p className="text-white">Loading assessment...</p>;

  return (
    <div className="text-white p-6 max-w-4xl mx-auto space-y-6 bg-neutral-900 rounded-lg shadow">
      {parentId && (
        <button
          onClick={() => navigate(`/admin/assessments/${type}`)}
          className="mb-4 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
        >
          ← Back to {categoryLabel}
        </button>
      )}

      <h1 className="text-2xl font-bold">
        {parentId
          ? "Editing Follow-Ups"
          : `Editing ${TYPE_TO_CATEGORY[type] || type} Assessment`}
      </h1>

      {blocks.map((cat, catIndex) => (
        <div key={`${cat.category}-${catIndex}`} className="space-y-4">
          {!parentId && (
            <h2 className="text-lg font-semibold">
              {cat.title || categoryLabel}
            </h2>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleReorder(e, catIndex)}
          >
            <SortableContext
              items={cat.questions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {cat.questions.map((q) => (
                  <SortableItem key={q.id} id={q.id}>
                    <div className="bg-neutral-800 rounded p-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        {editingId === q.id ? (
                          <textarea
                            className="flex-1 px-2 py-1 bg-white text-black rounded resize-none overflow-hidden"
                            value={editingText}
                            onChange={(e) => {
                              setEditingText(e.target.value);
                              e.target.style.height = "auto";
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onBlur={() => handleEditCommit(cat)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleEditCommit(cat);
                              }
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            rows={1}
                          />
                        ) : (
                          <span
                            className="flex-1 cursor-text"
                            onClick={() => handleEditStart(q)}
                          >
                            {q.text || (
                              <span className="text-gray-400">
                                New question...
                              </span>
                            )}
                          </span>
                        )}

                        <div className="flex items-center gap-2 ml-2">
                          {!parentId && (
                            <button
                              onClick={() =>
                                navigate(`/admin/assessments/${type}/${q.id}`)
                              }
                              className="p-1 hover:bg-neutral-700 rounded"
                            >
                              <ChevronRight size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditStart(q)}
                            className="p-1 hover:bg-neutral-700 rounded"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id, catIndex)}
                            className="p-1 hover:bg-red-600 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => handleAddQuestion(catIndex)}
              className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
            >
              <Plus size={14} className="inline mr-1" />
              Add Question
            </button>
          </div>

          <div className="mt-4">
            <button
              disabled={!dirty}
              onClick={handleSaveAll}
              className={`px-4 py-2 rounded text-white font-semibold ${
                dirty
                  ? "bg-brand-600 hover:bg-brand-500"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Save All Changes
            </button>
          </div>
        </div>
      ))}

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
