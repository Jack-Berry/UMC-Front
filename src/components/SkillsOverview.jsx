import { useMemo, useState } from "react";
import SkillDetailModal from "./SkillDetailModal";

// normalise tag → human-friendly label
function displayTag(tag) {
  if (!tag) return "";
  return tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// aggregate tags + keep evidence
function aggregateAllTags(answers = []) {
  const filtered = answers.filter((a) => a.assessment_type !== "initial");

  const tagBuckets = {};
  filtered.forEach((a) => {
    (a.tags || []).forEach((tag) => {
      const label = displayTag(tag.name || tag);
      if (!tagBuckets[label]) tagBuckets[label] = { scores: [], evidence: [] };

      tagBuckets[label].scores.push(Number(a.score) || 0);
      tagBuckets[label].evidence.push({
        question: a.question_text || "(Unknown question)",
        answer: a.answer_text || `Score: ${a.score}`,
        raw: a, // keep raw object in case we need more later
      });
    });
  });

  return Object.entries(tagBuckets).map(([tag, { scores, evidence }]) => ({
    tag,
    score: Math.round(
      (scores.reduce((s, v) => s + v, 0) / scores.length) * 20 // 1–5 → 0–100
    ),
    evidence,
  }));
}

export default function SkillsOverview({ answers = [] }) {
  const data = useMemo(() => aggregateAllTags(answers), [answers]);
  const sorted = [...data].sort((a, b) => b.score - a.score);

  const topSkills = sorted.slice(0, 3);
  const growthAreas = sorted.slice(-3);

  // modal state
  const [selectedSkill, setSelectedSkill] = useState(null);

  return (
    <div className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 p-4 sm:p-6 shadow-md space-y-6">
      {/* Top & Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top skills */}
        <div className="bg-neutral-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-green-400 font-semibold mb-3">Your Top Skills</h4>
          <ul className="space-y-2">
            {topSkills.map((s) => (
              <li
                key={s.tag}
                onClick={() => setSelectedSkill(s)}
                className="flex justify-between px-3 py-2 bg-neutral-900 rounded-md cursor-pointer hover:bg-neutral-700"
              >
                <span>{s.tag}</span>
                <span className="text-green-400 font-semibold">{s.score}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth areas */}
        <div className="bg-neutral-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-red-400 font-semibold mb-3">Areas for Growth</h4>
          <ul className="space-y-2">
            {growthAreas.map((s) => (
              <li
                key={s.tag}
                onClick={() => setSelectedSkill(s)}
                className="flex justify-between px-3 py-2 bg-neutral-900 rounded-md cursor-pointer hover:bg-neutral-700"
              >
                <span>{s.tag}</span>
                <span className="text-red-400 font-semibold">{s.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Heatmap */}
      <h4 className="text-gray-200 font-semibold mb-3">Skill Heatmap</h4>
      <div className="max-h-[300px] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {sorted.map((d) => {
            const color =
              d.score < 40
                ? "bg-red-500"
                : d.score < 70
                ? "bg-yellow-500"
                : "bg-green-500";
            return (
              <div
                key={d.tag}
                onClick={() => setSelectedSkill(d)}
                className="flex flex-col items-center justify-center p-2 rounded-md bg-neutral-800 shadow-sm cursor-pointer hover:bg-neutral-700"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${color}`}
                >
                  {d.score}
                </div>
                <p className="mt-2 text-xs text-gray-300 text-center">
                  {d.tag}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Scores shown per tag across all categories (0–100). Click any skill to
        see why you got that score.
      </p>

      {/* Modal */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}
