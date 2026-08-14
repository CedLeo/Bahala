import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data.json");

// Simple JSON-file "database". Good enough for a hackathon MVP —
// swap for a real DB (Postgres/Mongo) post-hackathon.
async function readDb() {
  if (!existsSync(DB_PATH)) {
    return { reports: [] };
  }
  const raw = await readFile(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return { reports: [] };
  }
}

async function writeDb(data) {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getAllReports() {
  const db = await readDb();
  return db.reports;
}

export async function saveReport(report) {
  const db = await readDb();
  db.reports.push(report);
  await writeDb(db);
  return report;
}

export async function findReport(id) {
  const db = await readDb();
  return db.reports.find((r) => r.id === id);
}

export async function updateReport(id, updates) {
  const db = await readDb();
  const idx = db.reports.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  db.reports[idx] = { ...db.reports[idx], ...updates };
  await writeDb(db);
  return db.reports[idx];
}

export async function deleteReport(id) {
  const db = await readDb();
  const next = db.reports.filter((r) => r.id !== id);
  const removed = next.length !== db.reports.length;
  db.reports = next;
  await writeDb(db);
  return removed;
}
