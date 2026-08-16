import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register (Candidate Registration)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (role === "admin") {
      return res.status(403).json({ error: "Admin role registration is restricted" });
    }

    const emailClean = email.trim().toLowerCase();
    const exists = await User.findOne({ email: emailClean });
    if (exists) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: emailClean,
      password: hashedPassword,
      role: role || "candidate",
    });

    const token = signToken(newUser);
    res.status(201).json({ token, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Log authentication event into MongoDB
    await AuditLog.create({
      userId: user.id || user._id.toString(),
      userName: user.name,
      userRole: user.role,
      action: "User Sign In",
      target: "System Portal",
    });

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
