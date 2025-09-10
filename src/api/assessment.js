// src/api/assessment.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export const submitAssessment = async ({ userId, scoresByCategory }) => {
  const res = await fetch(`${API_URL}/api/assessment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, scoresByCategory }),
  });

  if (!res.ok) {
    throw new Error("Assessment submission failed");
  }

  return res.json();
};
