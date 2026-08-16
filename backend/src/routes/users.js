import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// GET /api/users  (admin only)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const db = await getDb();
  res.json({ users: db.data.users.map(publicUser) });
});

// PATCH /api/users/:id/role  (admin only)
router.patch("/:id/role", requireAuth, requireRole("admin"), async (req, res) => {
  const { newRole } = req.body || {};
  if (!newRole) return res.status(400).json({ error: "newRole is required" });

  const db = await getDb();
  const user = db.data.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.isMaster) return res.status(403).json({ error: "Cannot change the master admin's role" });

  user.role = newRole;
  await db.write();
  res.json({ user: publicUser(user) });
});

// DELETE /api/users/:id  (admin only)
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const db = await getDb();
  const target = db.data.users.find((u) => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: "User not found" });
  if (target.isMaster) return res.status(403).json({ error: "Cannot delete the master admin" });

  db.data.users = db.data.users.filter((u) => u.id !== req.params.id);
  await db.write();
  res.json({ success: true });
});

export default router;
