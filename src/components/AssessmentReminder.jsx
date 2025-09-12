// src/components/AssessmentReminder.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ClipboardList, CheckCircle2 } from "lucide-react";
import Toast from "./Toast";
import { wipeAllAssessments, wipeAssessment } from "../api/assessment";
import { getAssessment } from "../redux/assessmentSlice";

export default function AssessmentReminder() {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const assessments = useSelector((state) => state.assessments);
  const user = JSON.parse(localStorage.getItem("user"));

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
  const allComplete = completed === total;

  const handleReset = (slug, category) => {
    setToast({
      message: `Are you sure you want to reset your ${category} assessment? This cannot be undone.`,
      onConfirm: async () => {
        await wipeAssessment(slug, user.id);
        dispatch(getAssessment({ assessmentType: slug, userId: user.id }));
        setToast(null);
      },
      onCancel: () => setToast(null),
    });
  };

  const handleResetAll = () => {
    setToast({
      message:
        "Are you sure you want to reset ALL your assessments? This cannot be undone.",
      onConfirm: async () => {
        await wipeAllAssessments(user.id);
        [
          "initial",
          "diy",
          "technology",
          "self-care",
          "communication",
          "community",
        ].forEach((type) =>
          dispatch(getAssessment({ assessmentType: type, userId: user.id }))
        );
        setToast(null);
      },
      onCancel: () => setToast(null),
    });
  };

  return (
    <>
      <div className="p-5 rounded-lg shadow-lg relative bg-brand-700 text-white">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          {/* Left side */}
          <div className="flex items-center gap-3 flex-1">
            {allComplete ? (
              <CheckCircle2 className="w-6 h-6 shrink-0 text-green-400" />
            ) : (
              <ClipboardList className="w-6 h-6 shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {allComplete ? "Assessments Complete" : "Your Assessments"}
              </h3>
              <p className="text-sm text-gray-200">
                {allComplete
                  ? "All assessments complete — keep reviewing to track progress"
                  : `${completed} of ${total} completed`}
              </p>
              <div className="w-full h-2 bg-neutral-600 rounded mt-1">
                <div
                  className={`h-2 rounded ${
                    allComplete ? "bg-green-400" : "bg-brand-500"
                  }`}
                  style={{ width: `${(completed / total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <button
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2 rounded transition w-full sm:w-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded
              ? "Hide"
              : allComplete
              ? "Review / Update"
              : "Take Assessments"}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            expanded ? "max-h-[40rem] mt-4" : "max-h-0"
          }`}
        >
          {/* Initial */}
          <div
            className={`p-3 rounded flex justify-between items-center mb-2 ${
              status.initial ? "bg-green-800" : "bg-neutral-800"
            }`}
          >
            <span>Initial Assessment</span>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => navigate("/assessment/initial")}
                className="text-sm underline"
              >
                {status.initial ? "Review / Update" : "Start"}
              </button>
              {status.initial && (
                <button
                  onClick={() => handleReset("initial", "Initial")}
                  className="text-xs text-red-300 hover:text-red-200 underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* In-depth */}
          <ul className="space-y-2">
            {status.inDepth.map((a, i) => (
              <li
                key={i}
                className={`flex justify-between items-center p-3 rounded ${
                  a.completed ? "bg-green-800" : "bg-neutral-800"
                }`}
              >
                <span>{a.category}</span>
                <div className="flex gap-4 items-center">
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
                        navigate(`/assessment/${a.slug}`);
                      } else {
                        setModalCategory(a.category);
                        setModalOpen(true);
                      }
                    }}
                    className="text-sm underline"
                  >
                    {a.completed ? "Review / Update" : "Start"}
                  </button>
                  {a.completed && (
                    <button
                      onClick={() => handleReset(a.slug, a.category)}
                      className="text-xs text-red-300 hover:text-red-200 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Reset all */}
          <div className="mt-4 text-right">
            <button
              onClick={handleResetAll}
              className="text-sm text-red-300 hover:text-red-200 underline"
            >
              Reset All Assessments
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 text-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3">Coming Soon</h2>
            <p className="text-gray-300 mb-4">
              The <span className="font-semibold">{modalCategory}</span>{" "}
              assessment isn’t ready yet.
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

      {toast && (
        <Toast
          message={toast.message}
          onConfirm={toast.onConfirm}
          onCancel={toast.onCancel}
        />
      )}
    </>
  );
}
