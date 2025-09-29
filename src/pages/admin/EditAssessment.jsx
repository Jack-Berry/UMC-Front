// src/pages/admin/EditAssessment.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../../api/apiClient";
import { fetchTags } from "../../api/tags";
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
import {
  Trash2,
  Plus,
  ChevronRight,
  Pencil,
  Check,
  X,
  Tags,
} from "lucide-react";
import Toast from "../../components/Toast";
import TagSelector from "../../components/TagSelector";

import AdminTags from "./AdminTags";

const TYPE_TO_CATEGORY = {
  initial: "Initial Assessment",
  diy: "DIY & Repairs",
  technology: "Technology & Digital Skills",
  "self-care": "Well-being & Self-care",
  communication: "Communication & Relationships",
  community: "Community & Contribution",
};

const PLACEHOLDER = "New question...";

export default function EditAssessment() {
  const { type, parentId } = useParams(); // parentId: question id (normal) OR category label (initial)
  const navigate = useNavigate();

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingTagsId, setEditingTagsId] = useState(null);
  const [editingTagsText, setEditingTagsText] = useState("");
  const [dirty, setDirty] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState(
    TYPE_TO_CATEGORY[type] || type
  );
  const [toast, setToast] = useState(null);
  const [allTags, setAllTags] = useState([]);

  // category rename state (initial categories view)
  const [editingCategoryIdx, setEditingCategoryIdx] = useState(null);
  const [categoryDraft, setCategoryDraft] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const normalizeTag = (t) => t.trim().toLowerCase().replace(/\s+/g, "-");
  const displayTag = (tag) =>
    tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ---------- helpers (initial-only ops) ----------
  const deleteInitialCategory = async (category) => {
    // fetch all questions in this category, then delete them; cascades will remove follow-ups
    const qs = await apiFetch(
      `/api/admin/assessment/questions?type=initial&category=${encodeURIComponent(
        category
      )}`
    );
    await Promise.all(
      (qs || []).map((q) =>
        apiFetch(`/api/admin/assessment/questions/${q.id}`, {
          method: "DELETE",
        })
      )
    );
  };

  const renameInitialCategory = async (oldCategory, newCategory) => {
    // Try the server route first; if it 404s, fall back to bulk patch.
    try {
      await apiFetch(`/api/admin/assessment/update-category`, {
        method: "PATCH",
        body: JSON.stringify({ oldCategory, newCategory }),
      });
      return;
    } catch (err) {
      // fallback: bulk update each question's category
      const qs = await apiFetch(
        `/api/admin/assessment/questions?type=initial&category=${encodeURIComponent(
          oldCategory
        )}`
      );
      const payload = (qs || []).map((q, idx) => ({
        id: q.id,
        text: q.text,
        category: newCategory,
        parent_id: null,
        sort_order: q.sort_order ?? idx,
        tags: q.tags || [],
      }));
      if (payload.length) {
        await apiFetch(`/api/admin/assessment/questions/bulk`, {
          method: "PATCH",
          body: JSON.stringify({ questions: payload }),
        });
      }
    }
  };

  // ---------- load ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (type === "initial" && parentId) {
          // inside an initial category → load its questions
          const res = await apiFetch(
            `/api/admin/assessment/questions?type=initial&category=${encodeURIComponent(
              parentId
            )}`
          );
          if (!cancelled) {
            setCategoryLabel(parentId);
            setBlocks(formatAssessmentQuestions(res));
          }
        } else if (type === "initial" && !parentId) {
          // list categories
          const res = await apiFetch(
            `/api/admin/assessment/questions?type=initial`
          );
          if (!cancelled) {
            const byCat = {};
            for (const q of res) {
              if (!byCat[q.category]) byCat[q.category] = [];
              byCat[q.category].push(q);
            }
            setBlocks(
              Object.keys(byCat).map((cat) => ({
                category: cat,
                questions: byCat[cat],
              }))
            );
          }
        } else if (parentId) {
          // normal follow-ups view
          const [children, parent] = await Promise.all([
            apiFetch(`/api/admin/assessment/questions?parent_id=${parentId}`),
            apiFetch(`/api/admin/assessment/questions/${parentId}`).catch(
              () => null
            ),
          ]);
          if (!cancelled) {
            const label = parent?.category || TYPE_TO_CATEGORY[type] || type;
            setCategoryLabel(label);
            setBlocks([{ category: label, questions: children || [] }]);
          }
        } else {
          // normal top-level
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

  // ---------- load allTags initially ----------
  useEffect(() => {
    apiFetch("/api/tags")
      .then(setAllTags)
      .catch((e) => console.error("Failed to load tags", e));
  }, []);

  // 🔹 helper: refresh tags after AdminTags CRUD
  const refreshTags = async () => {
    try {
      const tags = await apiFetch("/api/tags");
      setAllTags(tags);
    } catch (e) {
      console.error("Failed to refresh tags", e);
    }
  };

  // ---------- question text edit ----------
  const commitEditingQuestion = () => {
    if (!editingId) return;
    setBlocks((prev) =>
      prev.map((c) => ({
        ...c,
        questions: c.questions.map((q) =>
          q.id === editingId
            ? { ...q, text: editingText.trim() || PLACEHOLDER }
            : q
        ),
      }))
    );
    setEditingId(null);
    setEditingText("");
    setDirty(true);
  };

  // ---------- tags edit ----------
  const commitEditingTags = () => {
    if (!editingTagsId) return;
    setBlocks((prev) =>
      prev.map((c) => ({
        ...c,
        questions: c.questions.map((q) =>
          q.id === editingTagsId
            ? {
                ...q,
                tags: editingTagsText
                  .split(",")
                  .map(normalizeTag) // apply normalisation
                  .filter(Boolean),
              }
            : q
        ),
      }))
    );
    setEditingTagsId(null);
    setEditingTagsText("");
    setDirty(true);
  };

  // ---------- save questions ----------
  const handleSaveAll = async () => {
    commitEditingQuestion();
    commitEditingTags();

    // In initial *category* view keep parent_id null (not the category name)
    const computedParentId =
      type === "initial" ? null : parentId ? parentId : null;

    const payload = blocks.flatMap((cat) =>
      cat.questions.map((q, idx) => ({
        id: q.id,
        text: q.text === PLACEHOLDER ? "" : q.text,
        category: cat.category || categoryLabel,
        parent_id: computedParentId,
        sort_order: idx,
        tags: q.tags || [],
      }))
    );

    try {
      await apiFetch(`/api/admin/assessment/questions/bulk`, {
        method: "PATCH",
        body: JSON.stringify({ questions: payload }),
      });
      setDirty(false);
    } catch (e) {
      console.error("Bulk save failed", e);
    }
  };

  // ---------- navigation ----------
  const handleDrill = async (qOrCat) => {
    commitEditingQuestion();
    commitEditingTags();
    if (dirty) await handleSaveAll();
    if (type === "initial" && !parentId) {
      navigate(
        `/admin/assessments/initial/${encodeURIComponent(qOrCat.category)}`
      );
    } else {
      navigate(`/admin/assessments/${type}/${qOrCat.id}`);
    }
  };

  const handleBack = async () => {
    commitEditingQuestion();
    commitEditingTags();
    if (dirty && !(type === "initial" && !parentId)) {
      await handleSaveAll();
    }
    if (type === "initial" && parentId) {
      navigate(`/admin/assessments/initial`);
    } else {
      navigate(`/admin/assessments/${type}`);
    }
  };

  // ---------- add ----------
  const handleAddCategory = async () => {
    try {
      const created = await apiFetch(`/api/admin/assessment/questions`, {
        method: "POST",
        body: JSON.stringify({
          assessment_type: "initial",
          category: "New Category",
          text: PLACEHOLDER,
          parent_id: null,
          tags: [],
        }),
      });
      setBlocks((prev) => {
        const next = [
          ...prev,
          { category: created.category, questions: [created] },
        ];
        setEditingCategoryIdx(next.length - 1);
        setCategoryDraft(created.category);
        return next;
      });
    } catch (e) {
      console.error("Failed to add category", e);
    }
  };

  const handleAddQuestion = async (catIndex) => {
    commitEditingQuestion();
    commitEditingTags();
    if (dirty) await handleSaveAll();
    try {
      const cat = blocks[catIndex];
      const created = await apiFetch(`/api/admin/assessment/questions`, {
        method: "POST",
        body: JSON.stringify({
          assessment_type: type,
          category: cat.category || categoryLabel,
          text: PLACEHOLDER,
          parent_id: parentId || null,
          tags: [],
        }),
      });
      setBlocks((prev) =>
        prev.map((c, idx) =>
          idx === catIndex ? { ...c, questions: [...c.questions, created] } : c
        )
      );
      setEditingId(created.id);
      setEditingText("");
    } catch (e) {
      console.error("Failed to add question", e);
    }
  };

  // ---------- category rename controls ----------
  const startEditCategory = (idx) => {
    setEditingCategoryIdx(idx);
    setCategoryDraft(blocks[idx].category);
  };
  const cancelEditCategory = () => {
    setEditingCategoryIdx(null);
    setCategoryDraft("");
  };
  const saveEditCategory = async () => {
    const idx = editingCategoryIdx;
    if (idx == null) return;
    const oldCategory = blocks[idx].category;
    const newCategory = (categoryDraft || "").trim();
    if (!newCategory || newCategory === oldCategory) {
      cancelEditCategory();
      return;
    }
    try {
      await renameInitialCategory(oldCategory, newCategory);
      setBlocks((prev) =>
        prev.map((c, i) => (i === idx ? { ...c, category: newCategory } : c))
      );
    } catch (e) {
      console.error("Failed to update category", e);
    } finally {
      cancelEditCategory();
    }
  };

  // ---------- delete ----------
  const handleDelete = (idOrCategory, catIndex) => {
    const msg =
      type === "initial" && !parentId
        ? `Delete entire category "${idOrCategory}" (and all its questions)?`
        : "Delete this question (and any follow-ups)?";

    setToast({
      message: msg,
      onConfirm: async () => {
        try {
          if (type === "initial" && !parentId) {
            await deleteInitialCategory(idOrCategory);
            setBlocks((prev) =>
              prev.filter((c) => c.category !== idOrCategory)
            );
          } else {
            await apiFetch(`/api/admin/assessment/questions/${idOrCategory}`, {
              method: "DELETE",
            });
            setBlocks((prev) =>
              prev.map((cat, idx) =>
                idx === catIndex
                  ? {
                      ...cat,
                      questions: cat.questions.filter(
                        (q) => q.id !== idOrCategory
                      ),
                    }
                  : cat
              )
            );
          }
          setToast(null);
        } catch (e) {
          console.error("Failed to delete", e);
        }
      },
      onCancel: () => setToast(null),
    });
  };

  if (loading) return <p className="text-white">Loading assessment...</p>;

  return (
    <div className="text-white p-6 max-w-4xl mx-auto space-y-6 bg-neutral-900 rounded-lg shadow">
      {parentId && (
        <button
          onClick={handleBack}
          className="mb-4 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-sm"
        >
          ← Back to {type === "initial" ? "Initial Assessment" : categoryLabel}
        </button>
      )}

      <h1 className="text-2xl font-bold">
        {parentId
          ? "Editing Questions"
          : type === "initial"
          ? "Editing Initial Assessment Categories"
          : `Editing ${TYPE_TO_CATEGORY[type] || type} Assessment`}
      </h1>

      {blocks.map((cat, catIndex) => (
        <div key={`${cat.category}-${catIndex}`} className="space-y-4">
          {/* no duplicated titles for initial category list */}
          {!(type === "initial" && !parentId) && !parentId && (
            <h2 className="text-lg font-semibold">
              {cat.category || categoryLabel}
            </h2>
          )}

          {type === "initial" && !parentId ? (
            <div className="bg-neutral-800 rounded p-3 shadow-sm flex justify-between items-center">
              {editingCategoryIdx === catIndex ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    className="flex-1 px-2 py-1 bg-white text-black rounded"
                    value={categoryDraft}
                    onChange={(e) => setCategoryDraft(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={saveEditCategory}
                    className="p-1 hover:bg-neutral-700 rounded"
                    title="Save"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={cancelEditCategory}
                    className="p-1 hover:bg-neutral-700 rounded"
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <span
                  className="flex-1 cursor-text"
                  onClick={() => startEditCategory(catIndex)}
                  title="Click to rename"
                >
                  {cat.category}
                </span>
              )}

              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => handleDrill(cat)}
                  className="p-1 hover:bg-neutral-700 rounded"
                  title="Edit questions in this category"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => handleDelete(cat.category, catIndex)}
                  className="p-1 hover:bg-red-600 rounded"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => {
                const { active, over } = e;
                if (!over || active.id === over.id) return;
                setBlocks((prev) => {
                  const next = [...prev];
                  const c = next[catIndex];
                  const oldIdx = c.questions.findIndex(
                    (q) => q.id === active.id
                  );
                  const newIdx = c.questions.findIndex((q) => q.id === over.id);
                  c.questions = arrayMove(c.questions, oldIdx, newIdx);
                  return next;
                });
                setDirty(true);
              }}
            >
              <SortableContext
                items={cat.questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-3">
                  {cat.questions.map((q) => (
                    <SortableItem key={q.id} id={q.id}>
                      <div className="bg-neutral-800 rounded p-3 shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          {editingId === q.id ? (
                            <textarea
                              className="flex-1 px-2 py-1 bg-white text-black rounded resize-none overflow-hidden"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onBlur={commitEditingQuestion}
                              autoFocus
                              rows={1}
                            />
                          ) : (
                            <span
                              className="flex-1 cursor-text"
                              onClick={() => {
                                setEditingId(q.id);
                                setEditingText(
                                  q.text === PLACEHOLDER ? "" : q.text || ""
                                );
                              }}
                            >
                              {q.text || (
                                <span className="text-gray-400">
                                  {PLACEHOLDER}
                                </span>
                              )}
                            </span>
                          )}
                          <div className="flex items-center gap-2 ml-2">
                            {!parentId && (
                              <button
                                onClick={() => handleDrill(q)}
                                className="p-1 hover:bg-neutral-700 rounded"
                                title="Edit follow-ups"
                              >
                                <ChevronRight size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(q.id, catIndex)}
                              className="p-1 hover:bg-red-600 rounded"
                              title="Delete question"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* tags editor */}
                        <div className="flex items-center gap-2 text-sm">
                          <Tags size={16} className="text-gray-400" />
                          <TagSelector
                            value={q.tags?.map((t) => t.name || t) || []}
                            options={allTags}
                            onChange={(newTags) => {
                              setBlocks((prev) =>
                                prev.map((c) => ({
                                  ...c,
                                  questions: c.questions.map((qq) =>
                                    qq.id === q.id
                                      ? { ...qq, tags: newTags }
                                      : qq
                                  ),
                                }))
                              );
                              setDirty(true);
                            }}
                          />
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}

          {type !== "initial" && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleAddQuestion(catIndex)}
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
              >
                <Plus size={14} className="inline mr-1" />
                Add Question
              </button>
            </div>
          )}
        </div>
      ))}

      {type === "initial" && !parentId && (
        <button
          onClick={handleAddCategory}
          className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm mt-4"
        >
          <Plus size={14} className="inline mr-1" />
          Add Category
        </button>
      )}

      {type !== "initial" && (
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
      )}

      {/* Tag Manager */}
      <div className="mt-8">
        <AdminTags onChange={refreshTags} />
      </div>

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
