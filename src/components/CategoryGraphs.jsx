// src/components/CategoryGraphs.jsx
import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function aggregatePerCategory(answers = []) {
  // Exclude initial assessment
  const filtered = answers.filter((a) => a.assessment_type !== "initial");

  // Group by category
  const buckets = {};
  filtered.forEach((a) => {
    const label = a.category || "Other";
    if (!buckets[label]) buckets[label] = [];
    buckets[label].push(Number(a.score) || 0);
  });

  return Object.entries(buckets).map(([category, scores]) => ({
    category,
    score: Math.round(
      (scores.reduce((s, v) => s + v, 0) / scores.length) * 20 // scale 1–5 → 0–100
    ),
  }));
}

export default function CategoryGraphs({ answers = [] }) {
  const [mode, setMode] = useState("radar"); // 'radar' | 'bar'
  const data = useMemo(() => aggregatePerCategory(answers), [answers]);

  return (
    <div className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 p-4 sm:p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex rounded-lg overflow-hidden border border-neutral-700">
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
            onClick={() => setMode("bar")}
            className={`px-3 py-1 text-sm ${
              mode === "bar"
                ? "bg-brand-600 text-white"
                : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="w-full h-[380px]">
        <ResponsiveContainer>
          {mode === "radar" ? (
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "#e5e7eb", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
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
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="category"
                tick={{ fill: "#e5e7eb", fontSize: 12 }}
                interval={0}
                angle={-15}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#e5e7eb", fontSize: 12 }}
              />
              <Tooltip
                formatter={(val) => `${val} / 100`}
                contentStyle={{
                  background: "#171717",
                  border: "1px solid #3f3f46",
                  color: "#fff",
                }}
              />
              <Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Each category is scored out of 100 based on your assessment answers.
      </p>
    </div>
  );
}
