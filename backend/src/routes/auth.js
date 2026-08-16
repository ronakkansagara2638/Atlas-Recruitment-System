import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDb, nextId } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { timestampNow } from "../utils/candidate.js";

const router = Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  if (role === "admin") {
    return res.status(403).json({ error: "Admin role registration is restricted" });
  }

  const db = await getDb();
  const exists = db.data.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: "An account with this email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: "user-" + nextId(db),
    name,
    email,
    password: hashed,
    role: role || "candidate",
    createdAt: new Date().toISOString().slice(0, 10),
  };

  db.data.users.push(newUser);
  await db.write();

  const token = signToken(newUser);
  res.status(201).json({ token, user: publicUser(newUser) });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password are required" });

  const db = await getDb();
  const user = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  db.data.auditLogs.unshift({
    id: "log-" + nextId(db),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: "User Sign In",
    target: "System Portal",
    timestamp: timestampNow(),
  });
  await db.write();

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const db = await getDb();
  const user = db.data.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: publicUser(user) });
});

export default router;
