// src/utils/formatAssessment.js
export function formatAssessmentQuestions(rows) {
  const categories = {};
  const parentLookup = {};

  // First pass: group parents into categories
  rows.forEach((q) => {
    if (!q.parent_id) {
      if (!categories[q.category]) {
        categories[q.category] = {
          category: q.category,
          title: q.category,
          description: "",
          questions: [],
        };
      }

      const parentObj = {
        id: q.id,
        text: q.text,
        followUps: { minScore: 1, questions: [] },
      };

      categories[q.category].questions.push(parentObj);
      parentLookup[q.id] = parentObj; // save ref for follow-ups
    }
  });

  // Second pass: attach follow-ups to their parent
  rows.forEach((q) => {
    if (q.parent_id) {
      const parent = parentLookup[q.parent_id];
      if (parent) {
        parent.followUps.questions.push({
          id: q.id,
          text: q.text,
        });
      } else {
        console.warn(`⚠️ No parent found for follow-up ${q.id}`);
      }
    }
  });

  // Return an array of category blocks
  return Object.values(categories);
}
