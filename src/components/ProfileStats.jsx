// src/components/ProfileStats.jsx
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircle, XCircle } from "lucide-react";

export default function ProfileStats() {
  const user = useSelector((state) => state.user.current);
  const profileCompletion = useSelector(
    (state) => state.user.profileCompletion
  );
  const assessments = useSelector((state) => state.assessments.byType);

  const completionPercent = Math.min(Math.ceil(profileCompletion * 100), 100);
  const [expanded, setExpanded] = useState(false);

  const score = user?.overall_score;
  const scoreLabel = useMemo(() => {
    if (!score) return { label: "Unrated", color: "bg-gray-500" };
    if (score < 2) return { label: "Getting Started", color: "bg-red-600" };
    if (score < 3.5)
      return { label: "Making Progress", color: "bg-yellow-500" };
    if (score < 4.5) return { label: "Strong Skills", color: "bg-green-500" };
    return { label: "Expert", color: "bg-brand-500" };
  }, [score]);

  // ✅ Check profile requirements
  const requirements = [
    {
      label: "Verify your email",
      done: !!user?.email_verified,
    },
    {
      label: "Add a profile picture",
      done:
        typeof user?.avatar_url === "string" &&
        user.avatar_url.trim() !== "" &&
        user.avatar_url !== "null" &&
        user.avatar_url !== "undefined",
    },

    {
      label: "Write something about yourself",
      done:
        (!!user?.about && user.about.trim().length > 10) ||
        (!!user?.useful_at && user.useful_at.trim().length > 2) ||
        (!!user?.useless_at && user.useless_at.trim().length > 2),
    },
  ];

  // ✅ Assessments requirements
  const assessmentLabels = {
    initial: "Initial Assessment",
    diy: "DIY Assessment",
    technology: "Technology Assessment",
    "self-care": "Self-care Assessment",
    communication: "Communication Assessment",
    community: "Community Assessment",
  };

  Object.entries(assessmentLabels).forEach(([key, label]) => {
    requirements.push({
      label: `Complete the ${label}`,
      done: assessments[key]?.completed || false,
    });
  });

  return (
    <div className="bg-neutral-800 p-4 rounded shadow space-y-4 relative">
      <h2 className="text-xl font-semibold">Your Progress</h2>
      <p className="text-sm text-gray-400">
        Based on your profile & assessments
      </p>

      {/* Profile Completion */}
      <div
        className="cursor-pointer group relative"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-sm mb-1 flex justify-between items-center">
          Profile Completion
          <span className="text-xs text-gray-400">(click for details)</span>
        </p>

        <div className="w-full bg-neutral-700 rounded h-3 overflow-hidden">
          <div
            className="bg-brand-500 h-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-1">
          {completionPercent}% complete{" "}
          {completionPercent === 100 && "🎉 Great job!"}
        </p>
      </div>

      {/* Expanded checklist */}
      {expanded && (
        <div className="mt-3 text-sm bg-neutral-700 p-3 rounded animate-fadeIn">
          <p className="font-medium mb-2">Checklist</p>
          <ul className="space-y-1">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {req.done ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={
                    req.done ? "text-gray-300 line-through" : "text-white"
                  }
                >
                  {req.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Score */}
      <div>
        <p className="text-sm mb-1">Current Score</p>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${scoreLabel.color}`}
            title={scoreLabel.label}
          />
          <span className="font-bold">{score ?? "N/A"}</span>
          <span className="text-xs text-gray-400">({scoreLabel.label})</span>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-400 italic">
        🎯 Badges and streaks coming soon!
      </div>
    </div>
  );
}
