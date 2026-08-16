import { JSONFilePreset } from "lowdb/node";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEED_USERS, SEED_JOBS, SEED_AUDIT_LOGS } from "./data/seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "data", "db.json");

const defaultData = {
  users: [],
  jobs: SEED_JOBS,
  auditLogs: SEED_AUDIT_LOGS,
  meta: { nextId: 1000 },
};

let db;

export async function getDb() {
  if (db) return db;

  db = await JSONFilePreset(DB_FILE, defaultData);

  // First boot: hash the seed users' plaintext demo passwords once.
  if (db.data.users.length === 0) {
    db.data.users = SEED_USERS.map((u) => ({
      ...u,
      password: bcrypt.hashSync(u.password, 10),
    }));
    await db.write();
  }

  return db;
}

export function nextId(db) {
  const id = db.data.meta.nextId++;
  return id.toString(36);
}
