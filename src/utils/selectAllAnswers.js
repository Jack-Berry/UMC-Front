// src/utils/selectAllAnswers.js
export function selectAllAnswers(byType) {
  const all = [];
  Object.entries(byType).forEach(([type, obj]) => {
    if (obj?.answers?.length) {
      obj.answers.forEach((a) => {
        all.push({
          ...a,
          assessment_type: type, // keep track of source
        });
      });
    }
  });
  return all;
}
