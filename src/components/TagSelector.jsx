import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function TagSelector({ value = [], options = [], onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleTag = (tag) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "Escape") setOpen(false);
        }}
        className="flex flex-wrap gap-1 px-2 py-1 bg-neutral-700 rounded text-sm w-full text-left min-h-[2rem]"
      >
        {value.length > 0 ? (
          value.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-brand-600 text-white px-2 py-0.5 rounded-full text-xs"
            >
              {tag.replace(/-/g, " ")}
              <X
                size={12}
                className="cursor-pointer hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation(); // prevent dropdown toggle
                  removeTag(tag);
                }}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-400">Select tags</span>
        )}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 bg-neutral-800 border border-neutral-700 rounded shadow max-h-60 overflow-y-auto w-72 p-2 grid grid-cols-2 auto-rows-min gap-1">
          {options.map((tag) => (
            <div
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={`px-2 py-1 text-center cursor-pointer rounded hover:bg-neutral-700 truncate ${
                value.includes(tag.name)
                  ? "bg-brand-600 text-white"
                  : "text-gray-200"
              }`}
            >
              {tag.name.replace(/-/g, " ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
