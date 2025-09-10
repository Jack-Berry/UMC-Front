// src/api/assessment.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

/**
 * Submit an assessment
 * @param {Object} params
 * @param {number} params.userId - ID of the user
 * @param {string} params.assessmentType - e.g. "initial", "DIY-deep-dive"
 * @param {Array} params.answers - Array of answers [{ questionId, questionText, category, score }]
 */
export const submitAssessment = async ({ assessmentType, answers }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = Number(storedUser?.id); // force it to number
  const res = await fetch(`${API_URL}/api/assessment/${assessmentType}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, answers }),
  });

  if (!res.ok) {
    throw new Error("Assessment submission failed");
  }

  return res.json();
};

export const fetchAssessment = async (assessmentType, userId) => {
  const res = await fetch(
    `${API_URL}/api/assessment/${assessmentType}/${userId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch assessment");
  }
  return res.json();
};
