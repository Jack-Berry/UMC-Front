// src/utils/calculateAssessmentScore.js

/**
 * Calculate assessment score from assessment answers.
 * @param {object} assessments - assessments.byType from Redux
 * @returns {number} totalScore
 */
export function calculateAssessmentScore(assessments) {
  if (!assessments) return 0;

  let total = 0;

  Object.values(assessments).forEach((assessment) => {
    if (!assessment?.answers || assessment.answers.length === 0) return;

    // Completion bonus
    total += 50;

    assessment.answers.forEach((a) => {
      const score = Number(a.score) || 0;
      if (a.is_followup) {
        // Advanced Qs are worth 1.5x
        total += score * 15;
      } else {
        // Base Qs are worth 10x
        total += score * 10;
      }
    });
  });

  return total;
}
