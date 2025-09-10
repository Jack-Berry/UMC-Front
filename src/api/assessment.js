// src/api/assessment.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

/**
 * Submit an assessment
 * @param {Object} params
 * @param {number} params.userId - ID of the user
 * @param {string} params.assessmentType - e.g. "initial", "DIY-deep-dive"
 * @param {Array} params.answers - Array of answers [{ questionId, questionText, category, score }]
 */
export const submitAssessment = async ({ userId, assessmentType, answers }) => {
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
