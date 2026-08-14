import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import {
  getAllReports,
  saveReport,
  findReport,
  updateReport,
  deleteReport,
} from "./db.js";
import { haversineMeters } from "./geo.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const SEVERITY_LEVELS = ["passable", "ankle", "knee", "impassable"];

// Reports auto-expire after this many hours of no re-confirmation,
// since flood conditions change fast. The client filters these out
// but we also expose `isStale` so the UI can visually fade them first.
const STALE_AFTER_HOURS = 6;

function isStale(report) {
  const hours = (Date.now() - new Date(report.updatedAt).getTime()) / 36e5;
  return hours > STALE_AFTER_HOURS;
}

// GET /api/reports - list all active flood reports
app.get("/api/reports", async (req, res) => {
  const reports = await getAllReports();
  const withMeta = reports
    .filter((r) => r.status !== "resolved")
    .map((r) => ({ ...r, isStale: isStale(r) }));
  res.json(withMeta);
});

function isValidPoint(point) {
  return (
    point &&
    typeof point.lat === "number" &&
    typeof point.lng === "number" &&
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng)
  );
}

// POST /api/reports - create a new flood report, defined as a segment
// between two points (start/end) marking where the flooding stretches.
app.post("/api/reports", async (req, res) => {
  const { start, end, streetName, severity, description, reporterName } =
    req.body || {};

  if (!isValidPoint(start) || !isValidPoint(end)) {
    return res.status(400).json({
      error: "start and end must each be { lat, lng } numbers",
    });
  }
  if (!SEVERITY_LEVELS.includes(severity)) {
    return res.status(400).json({
      error: `severity must be one of: ${SEVERITY_LEVELS.join(", ")}`,
    });
  }

  const lengthMeters = haversineMeters(start.lat, start.lng, end.lat, end.lng);

  const now = new Date().toISOString();
  const report = {
    id: nanoid(10),
    start: { lat: start.lat, lng: start.lng },
    end: { lat: end.lat, lng: end.lng },
    lengthMeters,
    streetName: (streetName || "").trim().slice(0, 120),
    severity,
    description: (description || "").trim().slice(0, 500),
    reporterName:
      (reporterName || "Anonymous").trim().slice(0, 60) || "Anonymous",
    confirmCount: 0,
    disputeCount: 0,
    authorityAlerted: false,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const saved = await saveReport(report);
  res.status(201).json(saved);
});

// POST /api/reports/:id/confirm - another user confirms flooding still there
app.post("/api/reports/:id/confirm", async (req, res) => {
  const existing = await findReport(req.params.id);
  if (!existing) return res.status(404).json({ error: "Report not found" });

  const updated = await updateReport(req.params.id, {
    confirmCount: existing.confirmCount + 1,
    updatedAt: new Date().toISOString(),
  });
  res.json(updated);
});

// POST /api/reports/:id/dispute - another user says it's no longer flooded
app.post("/api/reports/:id/dispute", async (req, res) => {
  const existing = await findReport(req.params.id);
  if (!existing) return res.status(404).json({ error: "Report not found" });

  const disputeCount = existing.disputeCount + 1;
  const updates = { disputeCount, updatedAt: new Date().toISOString() };

  // Auto-resolve once disputes clearly outweigh confirmations,
  // keeping the map trustworthy without needing a moderator.
  if (disputeCount >= 3 && disputeCount > existing.confirmCount) {
    updates.status = "resolved";
  }

  const updated = await updateReport(req.params.id, updates);
  res.json(updated);
});

// POST /api/reports/:id/alert-authorities - mark that authorities were notified
app.post("/api/reports/:id/alert-authorities", async (req, res) => {
  const existing = await findReport(req.params.id);
  if (!existing) return res.status(404).json({ error: "Report not found" });

  const updated = await updateReport(req.params.id, {
    authorityAlerted: true,
    updatedAt: new Date().toISOString(),
  });
  res.json(updated);
});

// DELETE /api/reports/:id - mark a report resolved/removed
app.delete("/api/reports/:id", async (req, res) => {
  const removed = await deleteReport(req.params.id);
  if (!removed) return res.status(404).json({ error: "Report not found" });
  res.status(204).end();
});

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Bahala server running on http://localhost:${PORT}`);
});
