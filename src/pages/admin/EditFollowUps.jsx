// src/pages/admin/EditFollowUps.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiFetch from "../../api/apiClient";
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

export default function EditFollowUps() {
  const { parentId } = useParams();
  const navigate = useNavigate();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(
          `/api/admin/assessment/questions?parent_id=${parentId}`
        );
        setFollowUps(res);
      } catch (e) {
        console.error("Failed to load follow-ups", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [parentId]);

  const handleReorder = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFollowUps((prev) => {
      const oldIdx = prev.findIndex((q) => q.id === active.id);
      const newIdx = prev.findIndex((q) => q.id === over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
    // TODO: send reorder to backend
  };

  const handleEditStart = (q) => {
    setEditingId(q.id);
    setEditingText(q.text || "");
  };

  const saveQuestionText = async (qId, newText) => {
    setFollowUps((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, text: newText } : q))
    );
    try {
      await apiFetch(`/api/admin/assessment/questions/${qId}`, {
        method: "PUT",
        body: JSON.stringify({ text: newText, prompt: newText }),
      });
    } catch (e) {
      console.error("Failed to save question text", e);
    }
  };

  const handleEditCommit = async () => {
    const id = editingId;
    const value = editingText.trim();
    setEditingId(null);
    if (!id || !value) return;
    await saveQuestionText(id, value);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this follow-up?")) return;
    try {
      await apiFetch(`/api/admin/assessment/questions/${id}`, {
        method: "DELETE",
      });
      setFollowUps((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      console.error("Failed to delete follow-up", e);
    }
  };

  const handleAdd = async () => {
    const text = prompt("Enter new follow-up question:");
    if (!text) return;

    try {
      const newQ = await apiFetch(`/api/admin/assessment/questions`, {
        method: "POST",
        body: JSON.stringify({
          parent_id: parentId,
          prompt: text,
          type: "scale",
          weight: 1,
        }),
      });
      setFollowUps((prev) => [...prev, newQ]);
    } catch (e) {
      console.error("Failed to add follow-up", e);
    }
  };

  if (loading) return <p className="text-white">Loading follow-ups...</p>;

  return (
    <div className="bg-neutral-900 min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Editing Follow-ups</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleReorder}
      >
        <SortableContext
          items={followUps.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {followUps.map((q) => (
              <SortableItem key={q.id} id={q.id}>
                <div className="p-3 bg-neutral-700 rounded flex justify-between items-center gap-3">
                  {editingId === q.id ? (
                    <textarea
                      className="flex-1 px-2 py-1 bg-white text-black rounded resize-none"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={handleEditCommit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleEditCommit();
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      rows={1}
                    />
                  ) : (
                    <button
                      type="button"
                      className="flex-1 text-left cursor-text"
                      onClick={() => handleEditStart(q)}
                    >
                      {q.text}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button
        onClick={handleAdd}
        className="mt-4 px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm"
      >
        + Add Follow-up
      </button>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 ml-3 px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 text-sm"
      >
        Back
      </button>
    </div>
  );
}
