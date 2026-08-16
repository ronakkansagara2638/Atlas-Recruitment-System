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

// NOTE: passwords below are plaintext ONLY for the seed/demo accounts so the
// existing frontend demo credentials keep working out of the box. They are
// hashed on first boot (see db.js). Any new user created through
// POST /api/auth/register is hashed immediately and never stored in plaintext.
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
    salaryRange: "\u20b924L - \u20b932L",
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
    candidates: [],
  },
  {
    id: "job-b2",
    title: "Product Designer",
    company: "Atlas Product Lab",
    department: "Design",
    level: "Mid",
    location: "Remote (India)",
    employmentType: "Full-Time",
    salaryRange: "\u20b916L - \u20b922L",
    openings: 1,
    status: "Published",
    createdAt: "2026-07-10",
    deadline: "2026-08-25",
    description:
      "Shape end-to-end product flows for our recruitment suite, from early concepts to polished, tested interfaces.",
    requirements: ["Product design experience", "Shipped B2B software", "Figma and design systems"],
    candidates: [],
  },
  {
    id: "job-c3",
    title: "Cloud Systems Architect",
    company: "Atlas Infrastructure",
    department: "DevOps",
    level: "Lead",
    location: "Pune (Hybrid)",
    employmentType: "Full-Time",
    salaryRange: "\u20b935L - \u20b945L",
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
