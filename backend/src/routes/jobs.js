import { Router } from "express";
import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { Candidate } from "../models/Candidate.js";
import { AuditLog } from "../models/AuditLog.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { calculateAtsScore } from "../utils/ats.js";

const router = Router();

// Helper to find job by custom string ID or ObjectId
async function findJobById(id) {
  if (!id) return null;
  let job = await Job.findOne({ id });
  if (!job && mongoose.Types.ObjectId.isValid(id)) {
    job = await Job.findById(id);
  }
  if (!job) {
    job = await Job.findOne({ _id: id });
  }
  return job;
}

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

// GET /api/jobs — public
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
    const job = await findJobById(req.params.id);
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

    const customId = "job-" + Math.random().toString(36).substr(2, 6);
    const newJob = await Job.create({
      id: customId,
      title: body.title,
      company: body.company || "Atlas Technologies",
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

    const user = req.user?.id ? await User.findById(req.user.id) : null;
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

    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    job.status = status;
    await job.save();

    const user = req.user?.id ? await User.findById(req.user.id) : null;
    await logAudit({ user, action: "Updated Job Status", target: `${job.title} -> ${status}` });

    res.json({ job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/:id/apply & POST /api/jobs/:id/candidates
async function handleCandidateApplication(req, res) {
  try {
    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    let user = null;
    if (req.user?.id) {
      try { user = await User.findById(req.user.id); } catch (e) {}
    }

    const applicantEmail = (req.body.candidate?.email || req.body.applicantEmail || req.body.email || user?.email || "candidate@atlas.hrms").trim().toLowerCase();
    const applicantName = (req.body.candidate?.name || req.body.applicantName || req.body.name || user?.name || "Alex Rivera").trim();

    const candId = `cand-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const { skills, expYears, experienceYears, education, summary, resumeFileName } = req.body.candidate || req.body || {};
    const candSkills = skills || job.requirements || ["React", "JavaScript", "HTML/CSS"];
    const exp = expYears || experienceYears || 4;
    const edu = education || "B.S. Computer Science";
    const atsResult = calculateAtsScore({ skills: candSkills, experienceYears: exp, education: edu }, job.requirements);

    const newCandObj = {
      candidateId: candId,
      name: applicantName,
      email: applicantEmail,
      stage: req.body.stage || "Applied",
      score: req.body.score || atsResult.totalScore,
      experienceYears: exp,
      education: edu,
      skills: candSkills,
      matchedSkills: atsResult.strongMatches || [],
      missingSkills: atsResult.missingRequirements || [],
      summary: summary || `${applicantName} submitted application for ${job.title}.`,
      resumeFileName: resumeFileName || "Resume_Document.pdf",
      history: [{ stage: "Applied", date: new Date().toISOString().slice(0, 10), updatedBy: applicantName }],
      appliedDate: new Date().toISOString().slice(0, 10),
    };

    // 1. Update/Add in Job candidates array
    const existingIdx = job.candidates.findIndex(c => c.email.toLowerCase() === applicantEmail);
    if (existingIdx >= 0) {
      job.candidates[existingIdx] = { ...job.candidates[existingIdx], ...newCandObj };
    } else {
      job.candidates.unshift(newCandObj);
    }
    await job.save();

    // 2. Also save into standalone Candidate collection in MongoDB
    await Candidate.findOneAndUpdate(
      { jobId: job.id || job._id.toString(), email: applicantEmail },
      { ...newCandObj, jobId: job.id || job._id.toString(), jobTitle: job.title },
      { upsert: true, new: true }
    );

    await logAudit({ user, action: "Submitted Candidate Application", target: `${job.title} (${applicantName})` });

    res.status(201).json({ candidate: job.candidates[0], atsScore: newCandObj.score });
  } catch (err) {
    console.error("Candidate apply error:", err);
    res.status(500).json({ error: err.message });
  }
}

router.post("/:id/apply", handleCandidateApplication);
router.post("/:id/candidates", handleCandidateApplication);

// DELETE /api/jobs/:id/candidates/by-email/:email — withdraw application
router.delete("/:id/candidates/by-email/:email", async (req, res) => {
  try {
    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const emailClean = req.params.email.toLowerCase();
    job.candidates = job.candidates.filter(c => c.email.toLowerCase() !== emailClean);
    await job.save();

    await Candidate.deleteMany({ jobId: job.id || job._id.toString(), email: emailClean });

    let user = null;
    if (req.user?.id) {
      try { user = await User.findById(req.user.id); } catch (e) {}
    }
    await logAudit({ user, action: "Withdrew Candidate Application", target: `${job.title}` });

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

    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const cand = job.candidates.find(c => c.id === req.params.candidateId || c.candidateId === req.params.candidateId || c._id?.toString() === req.params.candidateId);
    if (!cand) return res.status(404).json({ error: "Candidate not found" });

    cand.stage = stage;
    cand.history.push({ stage, date: new Date().toISOString().slice(0, 10), updatedBy: req.user?.name || "System" });

    await job.save();

    await Candidate.findOneAndUpdate(
      { jobId: job.id || job._id.toString(), email: cand.email },
      { stage, $push: { history: { stage, date: new Date().toISOString().slice(0, 10), updatedBy: req.user?.name || "System" } } }
    );

    const user = req.user?.id ? await User.findById(req.user.id) : null;
    await logAudit({ user, action: `Moved Candidate Stage -> ${stage}`, target: `${cand.name} (${job.title})` });

    res.json({ candidate: cand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/:id/candidates/:candidateId/schedule-interview
router.post("/:id/candidates/:candidateId/schedule-interview", requireAuth, requireRole("hr", "recruiter", "admin"), async (req, res) => {
  try {
    const { date, time, meetUrl } = req.body || {};
    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const cand = job.candidates.find(c => c.id === req.params.candidateId || c.candidateId === req.params.candidateId || c._id?.toString() === req.params.candidateId);
    if (!cand) return res.status(404).json({ error: "Candidate not found" });

    cand.interview = {
      date: date || new Date().toISOString().slice(0, 10),
      time: time || "10:00 AM",
      meetUrl: meetUrl || "https://meet.google.com/abc-defg-hij",
      status: "Scheduled",
    };
    cand.stage = "Interview Scheduled";

    await job.save();

    await Candidate.findOneAndUpdate(
      { jobId: job.id || job._id.toString(), email: cand.email },
      { interview: cand.interview, stage: "Interview Scheduled" }
    );

    const user = req.user?.id ? await User.findById(req.user.id) : null;
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
    const job = await findJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const cand = job.candidates.find(c => c.id === req.params.candidateId || c.candidateId === req.params.candidateId || c._id?.toString() === req.params.candidateId);
    if (!cand) return res.status(404).json({ error: "Candidate not found" });

    cand.interviewFeedback = {
      technicalRating: technicalRating || 5,
      communicationRating: communicationRating || 5,
      notes: notes || "Excellent interview performance.",
      verdict: verdict || "Selected",
    };
    cand.stage = verdict || "Selected";

    await job.save();

    await Candidate.findOneAndUpdate(
      { jobId: job.id || job._id.toString(), email: cand.email },
      { interviewFeedback: cand.interviewFeedback, stage: cand.stage }
    );

    const user = req.user?.id ? await User.findById(req.user.id) : null;
    await logAudit({ user, action: `Recorded HR Interview Feedback (${verdict || "Selected"})`, target: `${cand.name} (${job.title})` });

    res.json({ candidate: cand });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
