import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAssessment } from "../api/assessment";

export default function AssessmentReminder() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = Number(storedUser?.id);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState({
    initial: false,
    inDepth: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStatus() {
      try {
        // initial
        const initialData = await fetchAssessment("initial", userId);
        const initialComplete = (initialData.answers?.length || 0) > 0;

        // check in-depth categories dynamically
        const categories = [
          "DIY",
          "Technology",
          "Self-care",
          "Communication",
          "Community",
        ];

        const inDepthStatuses = await Promise.all(
          categories.map(async (cat) => {
            try {
              const res = await fetchAssessment(cat.toLowerCase(), userId);
              return {
                category: cat,
                completed: (res.answers?.length || 0) > 0,
              };
            } catch {
              return { category: cat, completed: false };
            }
          })
        );

        setStatus({ initial: initialComplete, inDepth: inDepthStatuses });
      } catch (err) {
        console.error("Failed to fetch assessment status", err);
      }
    }

    if (userId) {
      fetchStatus();
    }
  }, [userId]);

  const incomplete =
    !status.initial || status.inDepth.some((a) => !a.completed);

  if (!incomplete) return null;

  return (
    <>
      {/* Main Reminder */}
      <div className="bg-brand-700 text-white p-4 rounded shadow-md relative">
        <div className="flex justify-between items-center">
          <p>Complete your assessments here to unlock insights and awards!</p>
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 text-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3">Coming Soon 🚧</h2>
            <p className="text-gray-300 mb-4">
              The <span className="font-semibold">{modalCategory}</span>{" "}
              assessment isn’t ready yet — we’re working hard to bring it to
              you!
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
