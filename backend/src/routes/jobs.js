import { Router } from "express";
import { getDb, nextId } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { calculateAtsScore } from "../utils/ats.js";
import { makeCandidate, timestampNow } from "../utils/candidate.js";

const router = Router();

function logAudit(db, { user, action, target }) {
  db.data.auditLogs.unshift({
    id: "log-" + nextId(db),
    userId: user?.id || "anon",
    userName: user?.name || "User",
    userRole: user?.role || "candidate",
    action,
    target,
    timestamp: timestampNow(),
  });
}

// GET /api/jobs — public, so candidates can browse open roles without logging in
router.get("/", async (req, res) => {
  const db = await getDb();
  res.json({ jobs: db.data.jobs });
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json({ job });
});

// POST /api/jobs  (recruiter/admin)
router.post("/", requireAuth, requireRole("recruiter", "admin"), async (req, res) => {
  const db = await getDb();
  const body = req.body || {};
  if (!body.title) return res.status(400).json({ error: "title is required" });

  const job = {
    id: "job-" + nextId(db),
    status: body.status || "Published",
    createdAt: new Date().toISOString().slice(0, 10),
    candidates: [],
    ...body,
  };
  db.data.jobs.unshift(job);

  const dbUser = db.data.users.find((u) => u.id === req.user.id);
  logAudit(db, { user: dbUser, action: "Created Job Posting", target: job.title });

  await db.write();
  res.status(201).json({ job });
});

// PATCH /api/jobs/:id/status  (recruiter/admin)
router.patch("/:id/status", requireAuth, requireRole("recruiter", "admin"), async (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: "status is required" });

  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  job.status = status;

  const dbUser = db.data.users.find((u) => u.id === req.user.id);
  logAudit(db, { user: dbUser, action: "Updated Job Status", target: `${job.title} -> ${status}` });

  await db.write();
  res.json({ job });
});

// POST /api/jobs/:id/apply  (candidate — or public with applicantEmail/applicantName)
router.post("/:id/apply", requireAuth, async (req, res) => {
  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  if (job.status !== "Published") {
    return res.status(400).json({ error: "This job is currently not accepting applications" });
  }

  const dbUser = db.data.users.find((u) => u.id === req.user.id);
  const applicantEmail = dbUser?.email || req.body.applicantEmail;
  const applicantName = dbUser?.name || req.body.applicantName;
  if (!applicantEmail || !applicantName) {
    return res.status(400).json({ error: "applicantName and applicantEmail are required" });
  }

  const already = job.candidates.some((c) => c.email.toLowerCase() === applicantEmail.toLowerCase());
  if (already) return res.status(409).json({ error: "You have already applied for this job opening" });

  const { skills, expYears, education, summary } = req.body || {};
  const candidate = makeCandidate(db, {
    name: applicantName,
    email: applicantEmail,
    stage: "Applied",
    skills: skills || ["React", "JavaScript", "HTML/CSS", "Problem Solving"],
    experienceYears: expYears || 3,
    education: education || "B.S. Computer Science",
    summary: summary || `${applicantName} submitted application with resume.`,
    reqs: job.requirements,
  });

  job.candidates.unshift(candidate);
  logAudit(db, { user: dbUser, action: "Submitted Job Application", target: `${job.title} (${job.id})` });

  await db.write();
  res.status(201).json({ candidate, atsScore: candidate.score });
});

// DELETE /api/jobs/:id/candidates/by-email/:email — withdraw application
router.delete("/:id/candidates/by-email/:email", requireAuth, async (req, res) => {
  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  job.candidates = job.candidates.filter(
    (c) => c.email.toLowerCase() !== req.params.email.toLowerCase()
  );
  await db.write();
  res.json({ success: true });
});

// POST /api/jobs/:id/candidates  (recruiter/hr/admin manually add a candidate)
router.post("/:id/candidates", requireAuth, requireRole("recruiter", "hr", "admin"), async (req, res) => {
  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const candidate = makeCandidate(db, { ...req.body, reqs: job.requirements });
  job.candidates.unshift(candidate);

  const dbUser = db.data.users.find((u) => u.id === req.user.id);
  logAudit(db, { user: dbUser, action: "Added Candidate", target: `${candidate.name} (${job.id})` });

  await db.write();
  res.status(201).json({ candidate });
});

// PATCH /api/jobs/:id/candidates/:candidateId/stage  (recruiter/hr/admin)
router.patch(
  "/:id/candidates/:candidateId/stage",
  requireAuth,
  requireRole("recruiter", "hr", "admin"),
  async (req, res) => {
    const { stage } = req.body || {};
    if (!stage) return res.status(400).json({ error: "stage is required" });

    const db = await getDb();
    const job = db.data.jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const candidate = job.candidates.find((c) => c.id === req.params.candidateId);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    const dbUser = db.data.users.find((u) => u.id === req.user.id);
    candidate.stage = stage;
    candidate.history = [
      ...(candidate.history || []),
      { stage, date: new Date().toISOString().slice(0, 10), updatedBy: dbUser?.name || "System" },
    ];

    logAudit(db, { user: dbUser, action: "Moved Candidate Stage", target: `${candidate.name} -> ${stage}` });

    await db.write();
    res.json({ candidate });
  }
);

// POST /api/jobs/:id/candidates/:candidateId/interview  (hr/admin)
router.post(
  "/:id/candidates/:candidateId/interview",
  requireAuth,
  requireRole("hr", "admin"),
  async (req, res) => {
    const db = await getDb();
    const job = db.data.jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const candidate = job.candidates.find((c) => c.id === req.params.candidateId);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    candidate.interview = req.body;
    candidate.stage = "Interview Scheduled";

    const dbUser = db.data.users.find((u) => u.id === req.user.id);
    logAudit(db, { user: dbUser, action: "Scheduled Candidate Interview", target: candidate.name });

    await db.write();
    res.json({ candidate });
  }
);

// POST /api/jobs/:id/candidates/:candidateId/feedback  (hr/admin)
router.post(
  "/:id/candidates/:candidateId/feedback",
  requireAuth,
  requireRole("hr", "admin"),
  async (req, res) => {
    const db = await getDb();
    const job = db.data.jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const candidate = job.candidates.find((c) => c.id === req.params.candidateId);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    candidate.interviewFeedback = req.body;
    candidate.stage = req.body.verdict || "Selected";

    const dbUser = db.data.users.find((u) => u.id === req.user.id);
    logAudit(db, {
      user: dbUser,
      action: "Recorded Interview Feedback",
      target: `${candidate.name} (${req.body.verdict})`,
    });

    await db.write();
    res.json({ candidate });
  }
);

// POST /api/jobs/:id/candidates/:candidateId/assessment  (recruiter/hr/admin — AI skill assessment)
router.post(
  "/:id/candidates/:candidateId/assessment",
  requireAuth,
  requireRole("recruiter", "hr", "admin"),
  async (req, res) => {
    const db = await getDb();
    const job = db.data.jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const candidate = job.candidates.find((c) => c.id === req.params.candidateId);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    candidate.assessment = req.body;
    candidate.score = Math.max(candidate.score, req.body.score || 0);

    await db.write();
    res.json({ candidate });
  }
);

// POST /api/jobs/:id/ats-preview — score a hypothetical candidate against this job (no save)
router.post("/:id/ats-preview", requireAuth, async (req, res) => {
  const db = await getDb();
  const job = db.data.jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const result = calculateAtsScore(req.body, job.requirements);
  res.json(result);
});

export default router;
