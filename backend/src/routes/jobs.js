import { Router } from "express";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { calculateAtsScore } from "../utils/ats.js";

const router = Router();

async function logAudit({ user, action, target }) {
  try {
    await AuditLog.create({
      userId: user?.id || "anon",
      userName: user?.name || "User",
      userRole: user?.role || "candidate",
      action,
      target,
    });
  } catch (e) {}
}

// GET /api/jobs — public so candidates can browse roles
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs (recruiter/admin)
router.post("/", requireAuth, requireRole("recruiter", "admin"), async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.title) return res.status(400).json({ error: "title is required" });

    const newJob = await Job.create({
      title: body.title,
      department: body.department || "Engineering",
      location: body.location || "Remote",
      type: body.type || "Full-Time",
      level: body.level || "Mid-Senior",
      salary: body.salary || "$120,000 - $150,000",
      description: body.description || "Job Description",
      requirements: body.requirements || ["React", "JavaScript"],
      status: body.status || "Published",
      candidates: [],
      createdBy: req.user?.name || "Recruiter",
    });

    const user = await User.findById(req.user.id);
    await logAudit({ user, action: "Created Job Posting", target: newJob.title });

    res.status(201).json({ job: newJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/jobs/:id/status (recruiter/admin)
router.patch("/:id/status", requireAuth, requireRole("recruiter", "admin"), async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: "status is required" });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    job.status = status;
    await job.save();

    const user = await User.findById(req.user.id);
    await logAudit({ user, action: "Updated Job Status", target: `${job.title} -> ${status}` });

    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/:id/apply (candidate)
router.post("/:id/apply", requireAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const user = await User.findById(req.user.id);
    const applicantEmail = user?.email || req.body.applicantEmail;
    const applicantName = user?.name || req.body.applicantName;
    if (!applicantEmail || !applicantName) {
      return res.status(400).json({ error: "applicantName and applicantEmail are required" });
    }

    const already = job.candidates.some(c => c.email.toLowerCase() === applicantEmail.toLowerCase());
    if (already) {
      return res.status(409).json({ error: "You have already applied for this job opening" });
    }

    const { skills, expYears, education, summary, resumeFileName } = req.body || {};
    const candSkills = skills || job.requirements || ["React", "JavaScript", "HTML/CSS"];
    const exp = expYears || 4;
    const edu = education || "B.S. Computer Science";
    const atsResult = calculateAtsScore({ skills: candSkills, experienceYears: exp, education: edu }, job.requirements);

    const newCandidate = {
      name: applicantName,
      email: applicantEmail,
      stage: "Applied",
      score: atsResult.totalScore,
      experienceYears: exp,
      education: edu,
      skills: candSkills,
      matchedSkills: atsResult.strongMatches || [],
      missingSkills: atsResult.missingRequirements || [],
      summary: summary || `${applicantName} submitted application with resume.`,
      resumeFileName: resumeFileName || "Resume.pdf",
      history: [{ stage: "Applied", date: new Date().toISOString().slice(0, 10), updatedBy: applicantName }],
    };

    job.candidates.unshift(newCandidate);
    await job.save();

    await logAudit({ user, action: "Submitted Job Application", target: `${job.title} (${job.id})` });

    res.status(201).json({ candidate: job.candidates[0], atsScore: atsResult.totalScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/jobs/:id/candidates/by-email/:email — withdraw application
router.delete("/:id/candidates/by-email/:email", requireAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    job.candidates = job.candidates.filter(c => c.email.toLowerCase() !== req.params.email.toLowerCase());
    await job.save();

    const user = await User.findById(req.user.id);
    await logAudit({ user, action: "Withdrew Job Application", target: `${job.title}` });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/jobs/:id/candidates/:candidateId/stage
router.patch("/:id/candidates/:candidateId/stage", requireAuth, requireRole("recruiter", "hr", "admin"), async (req, res) => {
  try {
    const { stage } = req.body || {};
    if (!stage) return res.status(400).json({ error: "stage is required" });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const cand = job.candidates.find(c => c.id === req.params.candidateId || c._id.toString() === req.params.candidateId);
    if (!cand) return res.status(404).json({ error: "Candidate not found" });

    cand.stage = stage;
    cand.history.push({ stage, date: new Date().toISOString().slice(0, 10), updatedBy: req.user?.name || "System" });

    await job.save();

    const user = await User.findById(req.user.id);
    await logAudit({ user, action: `Moved Candidate Stage -> ${stage}`, target: `${cand.name} (${job.title})` });

    res.json({ candidate: cand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/:id/candidates/:candidateId/schedule-interview
router.post("/:id/candidates/:candidateId/schedule-interview", requireAuth, requireRole("hr", "recruiter", "admin"), async (req, res) => {
  try {
    const { date, time, meetUrl, type } = req.body || {};
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const cand = job.candidates.find(c => c.id === req.params.candidateId || c._id.toString() === req.params.candidateId);
    if (!cand) return res.status(404).json({ error: "Candidate not found" });

    cand.interview = {
      date: date || new Date().toISOString().slice(0, 10),
      time: time || "10:00 AM",
      meetUrl: meetUrl || "https://meet.google.com/abc-defg-hij",
      status: "Scheduled",
    };
    cand.stage = "Interview Scheduled";

    await job.save();

    const user = await User.findById(req.user.id);
    await logAudit({ user, action: "Scheduled Video Interview", target: `${cand.name} (${job.title})` });

    res.json({ candidate: cand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/:id/candidates/:candidateId/feedback
router.post("/:id/candidates/:candidateId/feedback", requireAuth, requireRole("hr", "admin"), async (req, res) => {
  try {
    const { technicalRating, communicationRating, notes, verdict } = req.body || {};
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const cand = job.candidates.find(c => c.id === req.params.candidateId || c._id.toString() === req.params.candidateId);
    if (!cand) return res.status(404).json({ error: "Candidate not found" });

    cand.interviewFeedback = {
      technicalRating: technicalRating || 5,
      communicationRating: communicationRating || 5,
      notes: notes || "Excellent interview performance.",
      verdict: verdict || "Selected",
    };
    cand.stage = verdict || "Selected";

    await job.save();

    const user = await User.findById(req.user.id);
    await logAudit({ user, action: `Recorded HR Interview Feedback (${verdict || "Selected"})`, target: `${cand.name} (${job.title})` });

    res.json({ candidate: cand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
