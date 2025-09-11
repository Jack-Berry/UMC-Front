// src/components/ProfileStats.jsx
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function ProfileStats() {
  const user = useSelector((state) => state.user.current);
  const profileCompletion = useSelector(
    (state) => state.user.profileCompletion
  );

  const completionPercent = Math.min(Math.ceil(profileCompletion * 100), 100);

  const score = user?.overall_score;
  const scoreLabel = useMemo(() => {
    if (!score) return { label: "Unrated", color: "bg-gray-500" };
    if (score < 2) return { label: "Getting Started", color: "bg-red-600" };
    if (score < 3.5)
      return { label: "Making Progress", color: "bg-yellow-500" };
    if (score < 4.5) return { label: "Strong Skills", color: "bg-green-500" };
    return { label: "Expert", color: "bg-brand-500" };
  }, [score]);

  return (
    <div className="bg-neutral-800 p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Your Progress</h2>
      <p className="text-sm text-gray-400">Based on your assessments</p>

      {completionPercent < 100 && (
        <div>
          <p className="text-sm mb-1">Profile Completion</p>
          <div className="w-full bg-neutral-700 rounded h-3 overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {completionPercent}% complete
          </p>
        </div>
      )}

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
