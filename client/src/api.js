const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getReports: () => request("/api/reports"),
  createReport: (report) =>
    request("/api/reports", {
      method: "POST",
      body: JSON.stringify(report),
    }),
  confirmReport: (id) =>
    request(`/api/reports/${id}/confirm`, { method: "POST" }),
  disputeReport: (id) =>
    request(`/api/reports/${id}/dispute`, { method: "POST" }),
  alertAuthorities: (id) =>
    request(`/api/reports/${id}/alert-authorities`, { method: "POST" }),
};
