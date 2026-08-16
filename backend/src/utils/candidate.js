import { calculateAtsScore } from "./ats.js";

export function makeCandidate(db, { name, email, stage, score, ...extra }) {
  const defaultSkills = ["React", "JavaScript", "Problem Solving", "Teamwork"];
  const atsResult = calculateAtsScore(
    { skills: extra.skills, experienceYears: extra.experienceYears, education: extra.education },
    extra.reqs || []
  );

  return {
    id: "cand-" + (db.data.meta.nextId++).toString(36),
    name,
    email,
    stage: stage || "Applied",
    score: score ?? atsResult.totalScore,
    atsBreakdown: atsResult.breakdown,
    strongMatches: extra.strongMatches || atsResult.strongMatches,
    missingRequirements: extra.missingRequirements || atsResult.missingRequirements,
    skills: extra.skills || defaultSkills,
    summary:
      extra.summary ||
      `${name} demonstrates solid experience with strong technical fundamentals and team collaboration skills.`,
    experienceYears: extra.experienceYears || 4,
    education: extra.education || "B.S. Computer Science",
    resumeUrl: extra.resumeUrl || `private://resumes/${name.toLowerCase().replace(/\s+/g, "_")}_cv.pdf`,
    interview: extra.interview || null,
    interviewFeedback: extra.interviewFeedback || null,
    assessment: extra.assessment || null,
    appliedAt: new Date().toISOString().slice(0, 10),
    history: [{ stage: "Applied", date: new Date().toISOString().slice(0, 10), updatedBy: "System" }],
  };
}

export function timestampNow() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}
