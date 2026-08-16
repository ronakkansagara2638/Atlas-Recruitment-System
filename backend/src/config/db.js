import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Candidate } from "../models/Candidate.js";
import { AuditLog } from "../models/AuditLog.js";
import { SEED_USERS, SEED_JOBS, SEED_AUDIT_LOGS } from "../data/seed.js";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/atlas_recruitment";
  
  try {
    await mongoose.connect(uri);
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

    // Auto-seed initial users if collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Seeding initial MongoDB users...");
      const seededUsers = SEED_USERS.map(u => ({
        ...u,
        password: bcrypt.hashSync(u.password, 10),
      }));
      await User.insertMany(seededUsers);
      console.log("✅ Initial users seeded into MongoDB.");
    }

    // Auto-seed initial jobs if collection is empty
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      console.log("🌱 Seeding initial MongoDB jobs...");
      await Job.insertMany(SEED_JOBS);
      console.log("✅ Initial jobs seeded into MongoDB.");
    }

    // Auto-seed standalone candidates if collection is empty
    const candCount = await Candidate.countDocuments();
    if (candCount === 0) {
      console.log("🌱 Seeding initial MongoDB candidates...");
      const candList = [];
      SEED_JOBS.forEach(j => {
        j.candidates.forEach(c => {
          candList.push({
            ...c,
            jobId: j.id,
            jobTitle: j.title,
          });
        });
      });
      if (candList.length > 0) {
        await Candidate.insertMany(candList);
        console.log(`✅ ${candList.length} candidates seeded into MongoDB candidates collection.`);
      }
    }

    // Auto-seed initial audit logs if collection is empty
    const logCount = await AuditLog.countDocuments();
    if (logCount === 0) {
      console.log("🌱 Seeding initial MongoDB audit logs...");
      await AuditLog.insertMany(SEED_AUDIT_LOGS);
      console.log("✅ Initial audit logs seeded into MongoDB.");
    }

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
