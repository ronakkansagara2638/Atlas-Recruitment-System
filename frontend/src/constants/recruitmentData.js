import { Shield, Briefcase, Users, User, Clock, FileText } from "lucide-react";

export const STAGES = ["Applied", "Under Review", "Shortlisted", "HR Review", "Interview Scheduled", "Interview Completed", "Selected", "Rejected", "Hired"];

export const JOB_STATUSES = ["Draft", "Published", "Paused", "Closed"];

export const STAGE_STYLE = {
  Applied:             { fg: "#2E6FB0", bg: "#E9F1FA", bar: "#2E6FB0" },
  "Under Review":      { fg: "#7A57C4", bg: "#F1ECFB", bar: "#7A57C4" },
  Shortlisted:         { fg: "#C8842C", bg: "#FBF1E1", bar: "#C8842C" },
  "HR Review":         { fg: "#9B51E0", bg: "#F3E8FC", bar: "#9B51E0" },
  "Interview Scheduled": { fg: "#B08A00", bg: "#FBF6DD", bar: "#D6A800" },
  "Interview Completed": { fg: "#27AE60", bg: "#E8F8F0", bar: "#27AE60" },
  Selected:            { fg: "#0F7A6B", bg: "#E4F5F1", bar: "#0F7A6B" },
  Rejected:            { fg: "#BE3D3D", bg: "#FBEAEA", bar: "#BE3D3D" },
  Hired:               { fg: "#0F7A6B", bg: "#E4F5F1", bar: "#0F7A6B" },
};

export const ROLES = {
  admin:          { label: "Admin",          icon: Shield, color: "#C8842C" },
  recruiter:      { label: "Recruiter",      icon: Briefcase, color: "#2E6FB0" },
  hr:             { label: "HR Manager",     icon: Users, color: "#7A57C4" },
  candidate:      { label: "Candidate",      icon: User, color: "#0F7A6B" },
};

export const PERMISSIONS = {
  admin: [
    "view_dashboard", "view_jobs", "manage_users", "view_analytics",
    "view_audit_logs", "view_system_settings", "manage_companies",
  ],
  recruiter: [
    "view_dashboard", "view_jobs", "create_job", "edit_job", "close_job",
    "generate_jd", "view_pipeline", "move_stage_any", "view_ats_scores",
    "shortlist_candidate", "forward_to_hr", "view_resumes",
  ],
  hr: [
    "view_dashboard", "view_shortlisted", "view_ats_scores", "view_resumes",
    "schedule_interviews", "add_interview_feedback", "make_hiring_decision",
    "move_stage_any",
  ],
  candidate: [
    "view_open_jobs", "apply_job", "view_my_applications", "view_my_interviews",
    "withdraw_application", "manage_my_profile",
  ],
};

export const MASTER_ADMIN = {
  id: "user-admin-master",
  name: "Master Admin",
  email: "admin@atlas.hrms",
  password: "Admin@12345",
  role: "admin",
  createdAt: "2026-01-01",
  isMaster: true,
};

export const INITIAL_USERS = [
  MASTER_ADMIN,
  {
    id: "user-recruiter-1",
    name: "Sarah Jenkins",
    email: "recruiter@atlas.hrms",
    password: "recruiter123",
    role: "recruiter",
    createdAt: "2026-06-15",
  },
  {
    id: "user-hr-1",
    name: "David Chen",
    email: "hr@atlas.hrms",
    password: "hr123",
    role: "hr",
    createdAt: "2026-06-20",
  },
  {
    id: "user-candidate-1",
    name: "Alex Rivera",
    email: "candidate@atlas.hrms",
    password: "candidate123",
    role: "candidate",
    createdAt: "2026-07-01",
  },
];

export function can(role, permission) {
  return (PERMISSIONS[role] || []).includes(permission);
}

let _id = 1000;
export const nextId = () => (_id++).toString(36);

/**
 * 0–100 Weighted ATS Scoring Algorithm
 * Breakdown:
 * - Skills Match: 40%
 * - Experience Match: 25%
 * - Education Match: 15%
 * - Keyword Match: 10%
 * - Requirements Fit: 10%
 */
export function calculateAtsScore(candidate = {}, jobRequirements = []) {
  const candidateSkills = candidate.skills || ["React", "JavaScript", "HTML/CSS"];
  const expYears = candidate.experienceYears || 3;
  const edu = candidate.education || "B.S. Computer Science";

  // 1. Skills Match (40 pts)
  const strongMatches = [];
  const missingRequirements = [];

  jobRequirements.forEach(req => {
    const reqLower = req.toLowerCase();
    const isMatched = candidateSkills.some(skill => 
      reqLower.includes(skill.toLowerCase()) || skill.toLowerCase().includes(reqLower.split(" ")[0])
    );
    if (isMatched) {
      strongMatches.push(req);
    } else {
      missingRequirements.push(req);
    }
  });

  const skillRatio = jobRequirements.length > 0 ? strongMatches.length / jobRequirements.length : 0.8;
  const skillsScore = Math.round(skillRatio * 40);

  // 2. Experience Match (25 pts)
  const expScore = expYears >= 5 ? 25 : expYears >= 3 ? 20 : expYears >= 1 ? 14 : 8;

  // 3. Education Match (15 pts)
  const eduScore = edu.toLowerCase().includes("m.tech") || edu.toLowerCase().includes("master") ? 15 :
                   edu.toLowerCase().includes("b.tech") || edu.toLowerCase().includes("b.e.") || edu.toLowerCase().includes("b.s.") ? 13 : 10;

  // 4. Keyword Match (10 pts)
  const keywordScore = Math.min(10, candidateSkills.length * 2);

  // 5. Requirements Fit (10 pts)
  const reqScore = Math.round(skillRatio * 10);

  const totalScore = Math.min(100, Math.max(45, skillsScore + expScore + eduScore + keywordScore + reqScore));

  return {
    totalScore,
    breakdown: {
      skillsScore,     // max 40
      expScore,        // max 25
      eduScore,        // max 15
      keywordScore,    // max 10
      reqScore,        // max 10
    },
    strongMatches: strongMatches.length > 0 ? strongMatches : ["Core Problem Solving", "Web Fundamentals"],
    missingRequirements,
  };
}

export function makeCandidate(name, email, stage, daysAgo, score, extra = {}) {
  const defaultSkills = ["React", "JavaScript", "Problem Solving", "Teamwork"];
  const atsResult = calculateAtsScore({ skills: extra.skills, experienceYears: extra.experienceYears, education: extra.education }, extra.reqs || []);

  return {
    id: nextId(),
    name,
    email,
    stage: stage || "Applied",
    appliedAt: daysAgo,
    score: score ?? atsResult.totalScore,
    atsBreakdown: atsResult.breakdown,
    strongMatches: extra.strongMatches || atsResult.strongMatches,
    missingRequirements: extra.missingRequirements || atsResult.missingRequirements,
    skills: extra.skills || defaultSkills,
    summary: extra.summary || `${name} demonstrates solid experience with strong technical fundamentals and team collaboration skills.`,
    experienceYears: extra.experienceYears || 4,
    education: extra.education || "B.S. Computer Science",
    resumeFileName: extra.resumeFileName || null,
    resumeUrl: extra.resumeUrl || `private://resumes/${name.toLowerCase().replace(/\s+/g, "_")}_cv.pdf`,
    interview: extra.interview || null,
    interviewFeedback: extra.interviewFeedback || null,
    assessment: extra.assessment || null,
    history: extra.history || [{ stage: "Applied", date: new Date().toISOString().slice(0, 10), updatedBy: "System" }],
  };
}

export const SEED_JOBS = [
  {
    id: "job-a1", title: "Senior Frontend Engineer", company: "Atlas Technologies",
    department: "Engineering", level: "Senior", location: "Bengaluru (Hybrid)",
    employmentType: "Full-Time", salaryRange: "₹24L - ₹32L", openings: 2,
    status: "Published", createdAt: "2026-07-02", deadline: "2026-08-30",
    description: "Own the frontend architecture for our core product surface, partnering closely with design and platform teams to ship reliable, fast interfaces.",
    requirements: ["React and modern state management", "UI performance and accessibility", "End-to-end domain ownership"],
    candidates: [
      makeCandidate("Sara Thomas", "sara.thomas@mail.com", "Selected", 12, 92, {
        skills: ["React", "TypeScript", "Redux", "UI performance and accessibility", "End-to-end domain ownership"],
        experienceYears: 6,
        education: "M.Tech Software Engineering - BITS Pilani",
        summary: "Exceptional frontend lead with 6 years experience. Shipped large scale React applications with 99.9% uptime.",
        interview: { date: "2026-08-16", time: "14:00", interviewer: "David Chen (HR Manager)", meetUrl: "https://meet.google.com/atl-src-sr", status: "Completed" },
        interviewFeedback: { rating: 5, notes: "Outstanding technical depth & leadership. Highly recommended for offer.", verdict: "Selected", date: "2026-08-16" },
      }),
      makeCandidate("Priya Nair", "priya.nair@mail.com", "Shortlisted", 6, 88, {
        skills: ["React", "JavaScript", "Webpack", "UI performance and accessibility"],
        experienceYears: 5,
        education: "B.Tech Computer Science - RVCE Bengaluru",
        summary: "Strong candidate specializing in design systems and accessibility. Forwarded to HR for interview scheduling.",
      }),
      makeCandidate("Arjun Mehta", "arjun.mehta@mail.com", "Under Review", 3, 74, {
        skills: ["React", "HTML/CSS", "JavaScript"],
        experienceYears: 3,
        education: "B.E. Information Technology - Mumbai Univ",
        summary: "Promising mid-level engineer with React background.",
      }),
    ],
  },
  {
    id: "job-b2", title: "Product Designer", company: "Atlas Product Lab",
    department: "Design", level: "Mid", location: "Remote (India)",
    employmentType: "Full-Time", salaryRange: "₹16L - ₹22L", openings: 1,
    status: "Published", createdAt: "2026-07-10", deadline: "2026-08-25",
    description: "Shape end-to-end product flows for our recruitment suite, from early concepts to polished, tested interfaces.",
    requirements: ["Product design experience", "Shipped B2B software", "Figma and design systems"],
    candidates: [
      makeCandidate("Ishita Verma", "ishita.v@mail.com", "Interview Scheduled", 8, 81, {
        skills: ["Figma", "Design Systems", "User Research", "B2B SaaS"],
        experienceYears: 4,
        education: "B.Des - NID Ahmedabad",
        summary: "Talented designer with excellent Figma portfolio.",
        interview: { date: "2026-08-18", time: "16:00", interviewer: "David Chen (HR)", meetUrl: "https://meet.google.com/atl-ish-vm", status: "Scheduled" },
      }),
    ],
  },
  {
    id: "job-c3", title: "Cloud Systems Architect", company: "Atlas Infrastructure",
    department: "DevOps", level: "Lead", location: "Pune (Hybrid)",
    employmentType: "Full-Time", salaryRange: "₹35L - ₹45L", openings: 1,
    status: "Draft", createdAt: "2026-08-01", deadline: "2026-09-15",
    description: "Architect and scale cloud Kubernetes clusters and CI/CD automation pipelines.",
    requirements: ["Kubernetes & Docker", "AWS Architecture", "Terraform Infrastructure as Code"],
    candidates: [],
  },
];

export const SEED_AUDIT_LOGS = [
  { id: "log-1", userId: "user-recruiter-1", userName: "Sarah Jenkins", userRole: "recruiter", action: "Created Job Posting", target: "Senior Frontend Engineer", timestamp: "2026-08-15 10:15:22" },
  { id: "log-2", userId: "user-hr-1", userName: "David Chen", userRole: "hr", action: "Viewed Private Candidate Resume", target: "Sara Thomas (job-a1)", timestamp: "2026-08-15 11:30:05" },
  { id: "log-3", userId: "user-hr-1", userName: "David Chen", userRole: "hr", action: "Scheduled Candidate Interview", target: "Priya Nair", timestamp: "2026-08-15 12:45:00" },
  { id: "log-4", userId: "user-admin-master", userName: "Master Admin", userRole: "admin", action: "Updated System Permissions", target: "HR Manager Group", timestamp: "2026-08-15 14:00:10" },
];

export const CANDIDATE_EMAIL = "candidate@atlas.hrms";
export const CANDIDATE_NAME = "Alex Rivera";
export const calculateMatch = calculateAtsScore;

export function nextStage(stage) {
  const order = ["Applied", "Under Review", "Shortlisted", "HR Review", "Interview Scheduled", "Interview Completed", "Selected", "Hired"];
  const i = order.indexOf(stage);
  return i >= 0 && i < order.length - 1 ? order[i + 1] : null;
}

export function prevStage(stage) {
  const order = ["Applied", "Under Review", "Shortlisted", "HR Review", "Interview Scheduled", "Interview Completed", "Selected", "Hired"];
  const i = order.indexOf(stage);
  return i > 0 ? order[i - 1] : null;
}
