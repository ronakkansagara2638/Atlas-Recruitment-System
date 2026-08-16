import { Router } from "express";
import { Candidate } from "../models/Candidate.js";
import { Job } from "../models/Job.js";

const router = Router();

// GET /api/candidates — Get all candidate applications across all jobs in MongoDB
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json({ candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/candidates/by-email/:email — Get candidate applications matching candidate email
router.get("/by-email/:email", async (req, res) => {
  try {
    const emailClean = req.params.email.toLowerCase();
    const candidates = await Candidate.find({ email: emailClean }).sort({ createdAt: -1 });
    res.json({ candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
