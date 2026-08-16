// Seed / default data for a fresh database.
// Mirrors src/constants/recruitmentData.js from the frontend so the API
// returns data compatible with the existing UI.

export const STAGES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "HR Review",
  "Interview Scheduled",
  "Interview Completed",
  "Selected",
  "Rejected",
  "Hired",
];

export const JOB_STATUSES = ["Draft", "Published", "Paused", "Closed"];

export const ROLES = ["admin", "recruiter", "hr", "candidate"];

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

export const SEED_USERS = [
  {
    id: "user-admin-master",
    name: "Master Admin",
    email: "admin@atlas.hrms",
    password: "Admin@12345",
    role: "admin",
    createdAt: "2026-01-01",
    isMaster: true,
  },
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

export const SEED_JOBS = [
  {
    id: "job-a1",
    title: "Senior Frontend Engineer",
    company: "Atlas Technologies",
    department: "Engineering",
    level: "Senior",
    location: "Bengaluru (Hybrid)",
    employmentType: "Full-Time",
    salaryRange: "₹24L - ₹32L",
    openings: 2,
    status: "Published",
    createdAt: "2026-07-02",
    deadline: "2026-08-30",
    description:
      "Own the frontend architecture for our core product surface, partnering closely with design and platform teams to ship reliable, fast interfaces.",
    requirements: [
      "React and modern state management",
      "UI performance and accessibility",
      "End-to-end domain ownership",
    ],
    candidates: [
      {
        candidateId: "cand-seed-1",
        name: "Alex Rivera",
        email: "candidate@atlas.hrms",
        stage: "Applied",
        score: 92,
        experienceYears: 4,
        education: "B.S. Computer Science",
        skills: ["React", "JavaScript", "HTML/CSS", "End-to-end domain ownership"],
        matchedSkills: ["React", "UI performance and accessibility"],
        missingSkills: ["End-to-end domain ownership"],
        summary: "Alex Rivera applied for Senior Frontend Engineer.",
        resumeFileName: "Alex_Rivera_Resume.pdf",
        history: [{ stage: "Applied", date: "2026-08-16", updatedBy: "Alex Rivera" }],
        appliedDate: "2026-08-16",
      },
      {
        candidateId: "cand-seed-2",
        name: "Sara Thomas",
        email: "sara.thomas@mail.com",
        stage: "Selected",
        score: 95,
        experienceYears: 6,
        education: "M.Tech Software Engineering - BITS Pilani",
        skills: ["React", "TypeScript", "Redux", "UI performance and accessibility", "End-to-end domain ownership"],
        matchedSkills: ["React", "UI performance and accessibility", "End-to-end domain ownership"],
        missingSkills: [],
        summary: "Exceptional frontend lead with 6 years experience. Shipped large scale React applications.",
        resumeFileName: "Sara_Thomas_Resume.pdf",
        interview: { date: "2026-08-16", time: "14:00", meetUrl: "https://meet.google.com/atl-src-sr", status: "Completed" },
        interviewFeedback: { technicalRating: 5, communicationRating: 5, notes: "Outstanding technical depth.", verdict: "Selected" },
        history: [{ stage: "Selected", date: "2026-08-16", updatedBy: "David Chen" }],
        appliedDate: "2026-08-10",
      },
      {
        candidateId: "cand-seed-3",
        name: "Priya Nair",
        email: "priya.nair@mail.com",
        stage: "Shortlisted",
        score: 88,
        experienceYears: 5,
        education: "B.Tech Computer Science - RVCE Bengaluru",
        skills: ["React", "JavaScript", "Webpack", "UI performance and accessibility"],
        matchedSkills: ["React", "UI performance and accessibility"],
        missingSkills: ["End-to-end domain ownership"],
        summary: "Strong candidate specializing in design systems.",
        resumeFileName: "Priya_Nair_Resume.pdf",
        history: [{ stage: "Shortlisted", date: "2026-08-12", updatedBy: "Sarah Jenkins" }],
        appliedDate: "2026-08-12",
      },
    ],
  },
  {
    id: "job-b2",
    title: "Product Designer",
    company: "Atlas Product Lab",
    department: "Design",
    level: "Mid",
    location: "Remote (India)",
    employmentType: "Full-Time",
    salaryRange: "₹16L - ₹22L",
    openings: 1,
    status: "Published",
    createdAt: "2026-07-10",
    deadline: "2026-08-25",
    description:
      "Shape end-to-end product flows for our recruitment suite, from early concepts to polished, tested interfaces.",
    requirements: ["Product design experience", "Shipped B2B software", "Figma and design systems"],
    candidates: [
      {
        candidateId: "cand-seed-4",
        name: "Ishita Verma",
        email: "ishita.v@mail.com",
        stage: "Interview Scheduled",
        score: 81,
        experienceYears: 4,
        education: "B.Des - NID Ahmedabad",
        skills: ["Figma", "Design Systems", "User Research", "B2B SaaS"],
        matchedSkills: ["Figma and design systems", "Shipped B2B software"],
        missingSkills: [],
        summary: "Talented designer with excellent Figma portfolio.",
        resumeFileName: "Ishita_Verma_Resume.pdf",
        interview: { date: "2026-08-18", time: "16:00", meetUrl: "https://meet.google.com/atl-ish-vm", status: "Scheduled" },
        history: [{ stage: "Interview Scheduled", date: "2026-08-14", updatedBy: "David Chen" }],
        appliedDate: "2026-08-14",
      },
    ],
  },
  {
    id: "job-c3",
    title: "Cloud Systems Architect",
    company: "Atlas Infrastructure",
    department: "DevOps",
    level: "Lead",
    location: "Pune (Hybrid)",
    employmentType: "Full-Time",
    salaryRange: "₹35L - ₹45L",
    openings: 1,
    status: "Draft",
    createdAt: "2026-08-01",
    deadline: "2026-09-15",
    description: "Architect and scale cloud Kubernetes clusters and CI/CD automation pipelines.",
    requirements: ["Kubernetes & Docker", "AWS Architecture", "Terraform Infrastructure as Code"],
    candidates: [],
  },
];

export const SEED_AUDIT_LOGS = [
  {
    id: "log-1",
    userId: "user-recruiter-1",
    userName: "Sarah Jenkins",
    userRole: "recruiter",
    action: "Created Job Posting",
    target: "Senior Frontend Engineer",
    timestamp: "2026-08-15 10:15:22",
  },
];
