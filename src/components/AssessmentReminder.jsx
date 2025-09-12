// src/components/AssessmentReminder.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipboardList } from "lucide-react";

export default function AssessmentReminder() {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const navigate = useNavigate();

  const assessments = useSelector((state) => state.assessments);

  const status = {
    initial: assessments.byType.initial?.completed || false,
    inDepth: [
      {
        category: "DIY",
        slug: "diy",
        completed: assessments.byType.diy?.completed || false,
      },
      {
        category: "Technology",
        slug: "technology",
        completed: assessments.byType.technology?.completed || false,
      },
      {
        category: "Self-care",
        slug: "self-care",
        completed: assessments.byType["self-care"]?.completed || false,
      },
      {
        category: "Communication",
        slug: "communication",
        completed: assessments.byType.communication?.completed || false,
      },
      {
        category: "Community",
        slug: "community",
        completed: assessments.byType.community?.completed || false,
      },
    ],
  };

  const total = 1 + status.inDepth.length;
  const completed =
    (status.initial ? 1 : 0) + status.inDepth.filter((a) => a.completed).length;
  const incomplete = completed < total;

  if (!incomplete) return null;

  return (
    <>
      <div className="bg-brand-700 text-white p-5 rounded-lg shadow-lg relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          {/* Left side: icon + progress */}
          <div className="flex items-center gap-3 flex-1">
            <ClipboardList className="w-6 h-6 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">Your Assessments</h3>
              <p className="text-sm text-gray-200">
                {completed} of {total} completed
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-600 rounded mt-1">
                <div
                  className="h-2 bg-brand-500 rounded"
                  style={{ width: `${(completed / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right side: button */}
          <button
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2 rounded transition w-full sm:w-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "Take Assessments"}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            expanded ? "max-h-96 mt-4" : "max-h-0"
          }`}
        >
          {/* Initial Assessment */}
          <div
            className={`p-3 rounded flex justify-between items-center mb-2 ${
              status.initial ? "bg-green-700" : "bg-neutral-800"
            }`}
          >
            <span>Initial Assessment</span>
            <button
              onClick={() => navigate("/assessment/initial")}
              className="text-sm underline"
            >
              {status.initial ? "Review / Update" : "Start"}
            </button>
          </div>

          {/* In-depth Assessments */}
          <ul className="space-y-2">
            {status.inDepth.map((a, i) => (
              <li
                key={i}
                className={`flex justify-between p-3 rounded ${
                  a.completed ? "bg-green-700" : "bg-neutral-800"
                }`}
              >
                <span>{a.category}</span>
                <button
                  onClick={() => {
                    if (
                      a.completed ||
                      [
                        "diy",
                        "technology",
                        "self-care",
                        "communication",
                        "community",
                      ].includes(a.slug)
                    ) {
                      // Allow live or completed assessments
                      navigate(`/assessment/${a.slug}`);
                    } else {
                      // Otherwise show "coming soon"
                      setModalCategory(a.category);
                      setModalOpen(true);
                    }
                  }}
                  className="text-sm underline"
                >
                  {a.completed ? "Review / Update" : "Start"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 text-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3">Coming Soon 🚧</h2>
            <p className="text-gray-300 mb-4">
              The <span className="font-semibold">{modalCategory}</span>{" "}
              assessment isn’t ready yet — we’re working on it!
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="w-full px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
