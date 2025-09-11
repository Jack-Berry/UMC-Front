// src/components/AssessmentReminder.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
        completed: assessments.byType.diy?.completed || false,
      },
      {
        category: "Technology",
        completed: assessments.byType.technology?.completed || false,
      },
      {
        category: "Self-care",
        completed: assessments.byType["self-care"]?.completed || false,
      },
      {
        category: "Communication",
        completed: assessments.byType.communication?.completed || false,
      },
      {
        category: "Community",
        completed: assessments.byType.community?.completed || false,
      },
    ],
  };

  const incomplete =
    !status.initial || status.inDepth.some((a) => !a.completed);

  if (!incomplete) return null;

  return (
    <>
      <div className="bg-brand-700 text-white p-4 rounded shadow-md relative">
        <div className="flex justify-between items-center">
          <p>Complete your assessments to unlock insights and awards!</p>
          <button
            className="underline text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "View"}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Initial Assessment */}
            <div
              className={`p-3 rounded flex justify-between items-center ${
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
                  className={`flex justify-between p-2 rounded ${
                    a.completed ? "bg-green-700" : "bg-neutral-800"
                  }`}
                >
                  <span>{a.category}</span>
                  <button
                    onClick={() => {
                      if (a.completed) {
                        navigate(`/assessment/${a.category.toLowerCase()}`);
                      } else {
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
        )}
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
