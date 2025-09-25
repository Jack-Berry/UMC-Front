import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// Normalise DB tag → human-readable
function displayTag(tag) {
  if (!tag) return "";
  return tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// fallback aggregator if DB fields missing
function aggregatePerTag(answers = [], category) {
  const filtered = answers.filter(
    (a) => a.assessment_type !== "initial" && a.category === category
  );

  const tagBuckets = {};
  filtered.forEach((a) => {
    (a.tags || []).forEach((tag) => {
      const label = displayTag(tag.name || tag);
      if (!tagBuckets[label]) tagBuckets[label] = [];
      tagBuckets[label].push(Number(a.score) || 0);
    });
  });

  return Object.entries(tagBuckets).map(([tag, scores]) => ({
    tag,
    score: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 20),
  }));
}

export default function TagGraphs({ answers = [], user, category, onBack }) {
  const [mode, setMode] = useState("bar");

  const data = useMemo(() => {
    if (user?.tag_scores) {
      // Build a set of tag slugs that belong to this category (from answers reference)
      const allowed = new Set();
      answers
        .filter((a) => a.category === category)
        .forEach((a) => {
          (a.tags || []).forEach((t) => allowed.add(t.name || t));
        });

      return Object.entries(user.tag_scores)
        .filter(([tag]) => allowed.has(tag))
        .map(([tag, score]) => ({
          tag: displayTag(tag),
          score: Number(score),
        }));
    }
    return aggregatePerTag(answers, category);
  }, [answers, user, category]);

  return (
    <div className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 p-4 sm:p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {category} — Breakdown
        </h3>
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to categories
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex rounded-lg overflow-hidden border border-neutral-700">
          <button
            onClick={() => setMode("bar")}
            className={`px-3 py-1 text-sm ${
              mode === "bar"
                ? "bg-brand-600 text-white"
                : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
            }`}
          >
            Bars
          </button>
          <button
            onClick={() => setMode("radar")}
            className={`px-3 py-1 text-sm ${
              mode === "radar"
                ? "bg-brand-600 text-white"
                : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
            }`}
          >
            Spider
          </button>
          <button
            onClick={() => setMode("heatmap")}
            className={`px-3 py-1 text-sm ${
              mode === "heatmap"
                ? "bg-brand-600 text-white"
                : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      <div className="w-full h-[380px]">
        <ResponsiveContainer>
          {mode === "bar" ? (
            <BarChart
              layout="vertical"
              data={[...data].sort((a, b) => b.score - a.score)}
              margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "#e5e7eb", fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="tag"
                tick={{ fill: "#e5e7eb", fontSize: 12 }}
                width={120}
              />
              <Tooltip
                formatter={(val) => `${val} / 100`}
                contentStyle={{
                  background: "#171717",
                  border: "1px solid #3f3f46",
                  color: "#fff",
                }}
              />
              <Bar dataKey="score" fill="#22d3ee" radius={[0, 6, 6, 0]} />
            </BarChart>
          ) : mode === "radar" ? (
            <RadarChart cx="50%" cy="50%" outerRadius="90%" data={data}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis
                dataKey="tag"
                tick={{ fill: "#e5e7eb", fontSize: 11 }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fill: "#9ca3af", fontSize: 10 }}
              />
              <Tooltip
                formatter={(val) => `${val} / 100`}
                contentStyle={{
                  background: "#171717",
                  border: "1px solid #3f3f46",
                  color: "#fff",
                }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#22d3ee"
                fill="#22d3ee"
                fillOpacity={0.35}
              />
            </RadarChart>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2">
              {[...data]
                .sort((a, b) => b.score - a.score)
                .map((d) => {
                  const color =
                    d.score < 40
                      ? "bg-red-500"
                      : d.score < 70
                      ? "bg-yellow-500"
                      : "bg-green-500";
                  return (
                    <div
                      key={d.tag}
                      className="flex flex-col items-center justify-center p-2 rounded-md bg-neutral-800 shadow-sm"
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
          )}
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Scores shown per tag within this category (0–100).
      </p>
    </div>
  );
}
