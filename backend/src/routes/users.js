import { Router } from "express";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/users (admin only)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/role (admin only)
router.patch("/:id/role", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { role } = req.body || {};
    if (!role) return res.status(400).json({ error: "role is required" });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (targetUser.isMaster) {
      return res.status(403).json({ error: "Master Admin role cannot be modified" });
    }

    targetUser.role = role;
    await targetUser.save();

    const adminUser = await User.findById(req.user.id);
    await AuditLog.create({
      userId: adminUser?.id || req.user.id,
      userName: adminUser?.name || "Admin",
      userRole: "admin",
      action: `Updated User Role -> ${role}`,
      target: `${targetUser.name} (${targetUser.email})`,
    });

    res.json({ user: targetUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (targetUser.isMaster) {
      return res.status(403).json({ error: "Master Admin account cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);

    const adminUser = await User.findById(req.user.id);
    await AuditLog.create({
      userId: adminUser?.id || req.user.id,
      userName: adminUser?.name || "Admin",
      userRole: "admin",
      action: "Deleted User Account",
      target: `${targetUser.name} (${targetUser.email})`,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
