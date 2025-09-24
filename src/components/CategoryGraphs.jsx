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
import TagGraphs from "./TagGraphs";

function aggregatePerCategory(answers = []) {
  const filtered = answers.filter((a) => a.assessment_type !== "initial");
  const buckets = {};
  filtered.forEach((a) => {
    const label = a.category || "Other";
    if (!buckets[label]) buckets[label] = [];
    buckets[label].push(Number(a.score) || 0);
  });
  return Object.entries(buckets).map(([category, scores]) => ({
    category,
    score: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 20),
  }));
}

export default function CategoryGraphs({ answers = [] }) {
  const [mode, setMode] = useState("radar");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const data = useMemo(() => aggregatePerCategory(answers), [answers]);

  if (selectedCategory) {
    return (
      <TagGraphs
        answers={answers}
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 p-4 sm:p-6 shadow-md">
      {/* Header + mode toggle */}
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

      {/* Hint banner */}
      <div className="mb-3 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-sm font-medium">
          Click a category below to see detailed skill breakdowns
        </span>
      </div>

      {/* Chart area */}
      <div className="w-full h-[550px]">
        <ResponsiveContainer>
          {mode === "radar" ? (
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="85%"
              data={data}
              margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
              onClick={(e) => {
                if (e && e.activeLabel) setSelectedCategory(e.activeLabel);
              }}
              className="cursor-pointer"
            >
              <PolarGrid stroke="#3f3f46" />
              <PolarAngleAxis
                dataKey="category"
                tick={({ x, y, payload, textAnchor }) => {
                  const words = payload.value.split(" & "); // split on ampersand (customise if needed)
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor={textAnchor}
                      fill="#e5e7eb"
                      fontSize={12}
                    >
                      {words.map((word, i) => (
                        <tspan key={i} x={x} dy={i === 0 ? 0 : 14}>
                          {word}
                        </tspan>
                      ))}
                    </text>
                  );
                }}
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
          ) : mode === "bar" ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              onClick={(state) => {
                if (state && state.activeLabel)
                  setSelectedCategory(state.activeLabel);
              }}
              className="cursor-pointer"
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
                    <button
                      key={d.category}
                      onClick={() => setSelectedCategory(d.category)}
                      className="flex flex-col items-center justify-center p-2 rounded-md bg-neutral-800 shadow-sm hover:bg-neutral-700 cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${color}`}
                      >
                        {d.score}
                      </div>
                      <p className="mt-2 text-xs text-gray-300 text-center">
                        {d.category}
                      </p>
                    </button>
                  );
                })}
            </div>
          )}
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Each category is scored out of 100.
      </p>
    </div>
  );
}
