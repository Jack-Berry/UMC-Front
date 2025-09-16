// src/components/SortableItem.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <li ref={setNodeRef} style={style} className="rounded bg-neutral-700">
      <div className="flex items-start gap-2 p-2">
        {/* Single, proper drag handle */}
        <button
          type="button"
          aria-label="Drag to reorder"
          className="shrink-0 p-2 rounded hover:bg-neutral-600 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        {/* Row content lives here */}
        <div className="flex-1">{children}</div>
      </div>
    </li>
  );
}
