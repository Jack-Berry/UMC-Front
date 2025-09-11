// src/api/assessment.js
import apiFetch from "./apiClient";

/**
 * Submit an assessment
 * @param {Object} params
 * @param {string} params.assessmentType - e.g. "initial", "DIY-deep-dive"
 * @param {Array} params.answers - Array of answers [{ questionId, questionText, category, score }]
 */
export const submitAssessment = async ({ assessmentType, answers }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = Number(storedUser?.id); // force to number

  return apiFetch(`/api/assessment/${assessmentType}`, {
    method: "POST",
    body: JSON.stringify({ userId, answers }),
  });
};

export const fetchAssessment = (assessmentType, userId) =>
  apiFetch(`/api/assessment/${assessmentType}/${userId}`, {
    method: "GET",
  });
