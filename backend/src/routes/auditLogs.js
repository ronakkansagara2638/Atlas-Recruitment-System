import { Router } from "express";
import { AuditLog } from "../models/AuditLog.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/audit-logs (admin, hr, recruiter)
router.get("/", requireAuth, requireRole("admin", "hr", "recruiter"), async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().sort({ createdAt: -1 });
    res.json({ auditLogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/audit-logs (log action)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { action, target } = req.body || {};
    const newLog = await AuditLog.create({
      userId: req.user.id,
      userName: req.user.name || "User",
      userRole: req.user.role || "candidate",
      action: action || "User Action",
      target: target || "System Resource",
    });
    res.status(201).json({ auditLog: newLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
