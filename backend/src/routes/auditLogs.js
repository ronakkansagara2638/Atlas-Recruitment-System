import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/audit-logs  (admin, hr, recruiter)
router.get("/", requireAuth, requireRole("admin", "hr", "recruiter"), async (req, res) => {
  const db = await getDb();
  res.json({ auditLogs: db.data.auditLogs });
});

export default router;
