import { useState } from "react";

export default function AssessmentReminder() {
  const [expanded, setExpanded] = useState(false);

  const inDepthAssessments = [
    { category: "DIY", completed: false },
    { category: "Technology", completed: true },
    { category: "Self-care", completed: false },
    { category: "Communication", completed: false },
    { category: "Community", completed: true },
  ];

  const incomplete = inDepthAssessments.some((a) => !a.completed);

  if (!incomplete) return null;

  return (
    <div className="bg-brand-700 text-white p-4 rounded shadow-md relative">
      <div className="flex justify-between items-center">
        <p>
          Complete your in-depth assessments to unlock scores, insights, and
          awards!
        </p>
        <button
          className="underline text-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide" : "View"}
        </button>
      </div>
      {expanded && (
        <ul className="mt-4 space-y-2">
          {inDepthAssessments.map((a, i) => (
            <li
              key={i}
              className={`flex justify-between p-2 rounded ${
                a.completed
                  ? "bg-green-700 text-white"
                  : "bg-neutral-800 text-gray-300"
              }`}
            >
              <span>{a.category}</span>
              <span>{a.completed ? "Completed" : "Incomplete"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
