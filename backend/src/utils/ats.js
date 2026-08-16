// 0-100 weighted ATS scoring algorithm, ported from the frontend
// (src/constants/recruitmentData.js) so both sides agree on the same score.
//
// Breakdown: Skills 40% | Experience 25% | Education 15% | Keywords 10% | Requirements fit 10%
export function calculateAtsScore(candidate = {}, jobRequirements = []) {
  const candidateSkills = candidate.skills?.length ? candidate.skills : ["React", "JavaScript", "HTML/CSS"];
  const expYears = candidate.experienceYears ?? 3;
  const edu = candidate.education || "B.S. Computer Science";

  const strongMatches = [];
  const missingRequirements = [];

  jobRequirements.forEach((req) => {
    const reqLower = req.toLowerCase();
    const isMatched = candidateSkills.some(
      (skill) => reqLower.includes(skill.toLowerCase()) || skill.toLowerCase().includes(reqLower.split(" ")[0])
    );
    if (isMatched) strongMatches.push(req);
    else missingRequirements.push(req);
  });

  const skillRatio = jobRequirements.length > 0 ? strongMatches.length / jobRequirements.length : 0.8;
  const skillsScore = Math.round(skillRatio * 40);

  const expScore = expYears >= 5 ? 25 : expYears >= 3 ? 20 : expYears >= 1 ? 14 : 8;

  const eduLower = edu.toLowerCase();
  const eduScore =
    eduLower.includes("m.tech") || eduLower.includes("master")
      ? 15
      : eduLower.includes("b.tech") || eduLower.includes("b.e.") || eduLower.includes("b.s.")
      ? 13
      : 10;

  const keywordScore = Math.min(10, candidateSkills.length * 2);
  const reqScore = Math.round(skillRatio * 10);

  const totalScore = Math.min(100, Math.max(45, skillsScore + expScore + eduScore + keywordScore + reqScore));

  return {
    totalScore,
    breakdown: { skillsScore, expScore, eduScore, keywordScore, reqScore },
    strongMatches: strongMatches.length > 0 ? strongMatches : ["Core Problem Solving", "Web Fundamentals"],
    missingRequirements,
  };
}
