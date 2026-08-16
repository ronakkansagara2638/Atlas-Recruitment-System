// Thin fetch wrapper for the Atlas Recruitment backend.
// Set VITE_API_URL in a .env file (see .env.example) — defaults to
// http://localhost:5000/api for local development against `backend/`.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "atlas_hrms_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  // Auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  me: () => request("/auth/me"),

  // Users (admin)
  listUsers: () => request("/users"),
  updateUserRole: (id, newRole) => request(`/users/${id}/role`, { method: "PATCH", body: { newRole } }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),

  // Jobs
  listJobs: () => request("/jobs", { auth: false }),
  getJob: (id) => request(`/jobs/${id}`, { auth: false }),
  createJob: (job) => request("/jobs", { method: "POST", body: job }),
  updateJobStatus: (id, status) => request(`/jobs/${id}/status`, { method: "PATCH", body: { status } }),

  // Candidates / applications
  applyToJob: (jobId, payload) => request(`/jobs/${jobId}/apply`, { method: "POST", body: payload }),
  withdrawApplication: (jobId, email) =>
    request(`/jobs/${jobId}/candidates/by-email/${encodeURIComponent(email)}`, { method: "DELETE" }),
  addCandidate: (jobId, candidate) => request(`/jobs/${jobId}/candidates`, { method: "POST", body: candidate }),
  moveCandidateStage: (jobId, candidateId, stage) =>
    request(`/jobs/${jobId}/candidates/${candidateId}/stage`, { method: "PATCH", body: { stage } }),
  scheduleInterview: (jobId, candidateId, interview) =>
    request(`/jobs/${jobId}/candidates/${candidateId}/interview`, { method: "POST", body: interview }),
  addInterviewFeedback: (jobId, candidateId, feedback) =>
    request(`/jobs/${jobId}/candidates/${candidateId}/feedback`, { method: "POST", body: feedback }),
  saveAssessment: (jobId, candidateId, assessment) =>
    request(`/jobs/${jobId}/candidates/${candidateId}/assessment`, { method: "POST", body: assessment }),
  atsPreview: (jobId, payload) => request(`/jobs/${jobId}/ats-preview`, { method: "POST", body: payload }),

  // Audit logs
  listAuditLogs: () => request("/audit-logs"),
};
