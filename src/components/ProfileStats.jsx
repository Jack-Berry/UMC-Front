// src/components/ProfileStats.jsx
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircle, XCircle } from "lucide-react";
import { calculateAssessmentScore } from "../utils/calculateAssessmentScore";
import { calculateProfileCompletion } from "../utils/profileCompletion";

export default function ProfileStats() {
  const user = useSelector((state) => state.user.current);
  const assessments = useSelector((state) => state.assessments.byType);

  const [expanded, setExpanded] = useState(false);

  // ✅ Calculate profile completion with new logic
  const completionPercent = useMemo(() => {
    return Math.min(
      Math.ceil(
        calculateProfileCompletion(user, { byType: assessments }) * 100
      ),
      100
    );
  }, [user, assessments]);

  const assessmentScore = useMemo(() => {
    return calculateAssessmentScore(assessments);
  }, [assessments]);

  const score = assessmentScore;
  const scoreLabel = useMemo(() => {
    if (!score) return { label: "Unrated", color: "bg-gray-500" };

    if (score <= 3000)
      return { label: "Getting Started", color: "bg-gray-400" };
    if (score <= 7500)
      return { label: "Finding Your Feet", color: "bg-sky-400" };
    if (score <= 15000)
      return { label: "Making Progress", color: "bg-sky-500" };
    if (score <= 25000)
      return { label: "Building Useful Skills", color: "bg-cyan-500" };
    if (score <= 40000)
      return { label: "Reliable & Capable", color: "bg-teal-500" };
    if (score <= 55000) return { label: "Well-Rounded", color: "bg-green-500" };
    if (score <= 70000)
      return { label: "Strong Skills", color: "bg-emerald-500" };
    if (score <= 85000)
      return { label: "Community Asset", color: "bg-indigo-500" };
    if (score <= 97850)
      return { label: "Leader Among Men", color: "bg-indigo-600" };

    return { label: "Legendary", color: "bg-brand-500" };
  }, [score]);

  // ✅ Checklist requirements
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
    {
      label: "Add your location",
      done: !!(user?.lat && user?.lng),
    },
  ];

  // ✅ Assessment requirements
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
      done: assessments?.[key]?.completed || false,
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
    </div>
  );
}
