// src/utils/profileCompletion.js

const PROFILE_CRITERIA = {
  assessments: 0.5,
  emailVerified: 0.2,
  profilePicture: 0.15,
  aboutSection: 0.15,
};

export function calculateAssessmentCompletion(statusOrByType) {
  if (!statusOrByType) return 0;

  // ✅ Handle Redux shape: { byType: { initial, diy, ... } }
  if (statusOrByType.byType) {
    const byType = statusOrByType.byType;
    const initial = byType.initial?.completed || false;
    const inDepthKeys = [
      "diy",
      "technology",
      "self-care",
      "communication",
      "community",
    ];

    const inDepth = inDepthKeys.map((key) => byType[key]?.completed || false);

    const total = 1 + inDepth.length;
    const completed = (initial ? 1 : 0) + inDepth.filter(Boolean).length;
    return total > 0 ? completed / total : 0;
  }

  // ✅ Handle old shape: { initial: bool, inDepth: [{completed}] }
  const total = 1 + (statusOrByType.inDepth?.length || 0);
  const completed =
    (statusOrByType.initial ? 1 : 0) +
    (statusOrByType.inDepth?.filter((a) => a.completed).length || 0);

  return total > 0 ? completed / total : 0;
}

export function calculateProfileCompletion(user, assessmentStatus) {
  if (!user) return 0;

  console.log("calculateProfileCompletion got:", assessmentStatus);

  const assessmentsDone = calculateAssessmentCompletion(assessmentStatus);

  const emailVerified = !!user.email_verified;
  const hasProfilePic = !!user.profile_picture_url;
  const hasAbout = !!user.about && user.about.trim().length > 10;

  let score = 0;
  score += assessmentsDone * PROFILE_CRITERIA.assessments;
  score += (emailVerified ? 1 : 0) * PROFILE_CRITERIA.emailVerified;
  score += (hasProfilePic ? 1 : 0) * PROFILE_CRITERIA.profilePicture;
  score += (hasAbout ? 1 : 0) * PROFILE_CRITERIA.aboutSection;

  return score;
}
