// src/utils/formatAssessment.js
export function formatAssessmentQuestions(rows) {
  const categories = {};
  const parentLookup = {};

  // 🔹 Toggle advanced follow-up behavior
  // true  = load parents first, unlock follow-ups later (score-based)
  // false = load all parents + follow-ups as separate pages immediately
  const USE_MIN_SCORE = false; // 👈 flip this

  // Universal threshold when score-based mode is on
  const defaultMinScore = 4;

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
        sort_order: q.sort_order ?? 0,
        active: q.active ?? true,
        version: q.version ?? 1,
        tags: q.tags || [],
        followUps: {
          minScore: USE_MIN_SCORE ? defaultMinScore : 0,
          questions: [],
        },
      };

      categories[q.category].questions.push(parentObj);
      parentLookup[q.id] = parentObj;
    }
  });

  // Second pass: attach follow-ups to their parent
  rows.forEach((q) => {
    if (q.parent_id) {
      const parent = parentLookup[q.parent_id];
      if (parent) {
        const child = {
          id: q.id,
          text: q.text,
          sort_order: q.sort_order ?? 0,
          active: q.active ?? true,
          version: q.version ?? 1,
          tags: q.tags || [],
          followUpsParent: parent.id,
        };

        if (USE_MIN_SCORE) {
          // ✅ Score-based mode: hold children until triggered
          parent.followUps.questions.push(child);
        } else {
          // 🚀 Immediate mode: make a new "advanced" category straight away
          const advancedCategory = `${parent.id}-advanced`;
          if (!categories[advancedCategory]) {
            categories[advancedCategory] = {
              category: advancedCategory,
              title: `Advanced ${parent.category || ""}`,
              description: `Follow-up: ${parent.text}`,
              questions: [],
            };
          }
          categories[advancedCategory].questions.push(child);
        }
      } else {
        console.warn(`⚠️ No parent found for follow-up ${q.id}`);
      }
    }
  });

  return Object.values(categories);
}
