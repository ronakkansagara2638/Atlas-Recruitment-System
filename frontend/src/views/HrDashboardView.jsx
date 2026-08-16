import React, { useState } from "react";
import { Users, Award, Calendar, CheckCircle2, FileText, Star, Lock, Video, Sparkles, MessageSquare } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { AtsScoreBreakdownModal } from "../components/modals/AtsScoreBreakdownModal";
import { CandidateDetailModal } from "../components/modals/CandidateDetailModal";
import { ScheduleInterviewModal } from "../components/modals/ScheduleInterviewModal";
import { InterviewFeedbackModal } from "../components/modals/InterviewFeedbackModal";

export function HrDashboardView() {
  const { state, dispatch } = useStore();
  const [selectedScoreCandidate, setSelectedScoreCandidate] = useState(null);
  const [selectedDetailCandidate, setSelectedDetailCandidate] = useState(null);
  const [selectedScheduleCandidate, setSelectedScheduleCandidate] = useState(null);
  const [selectedFeedbackCandidate, setSelectedFeedbackCandidate] = useState(null);

  const allCandidates = state.jobs.flatMap(j => j.candidates.map(c => ({ ...c, jobTitle: j.title, jobId: j.id, jobReqs: j.requirements })));

  const shortlisted = allCandidates.filter(c => ["Shortlisted", "HR Review", "Interview Scheduled", "Interview Completed", "Selected", "Hired"].includes(c.stage));
  const scheduledInterviews = allCandidates.filter(c => c.interview && c.interview.date);
  const selectedCount = allCandidates.filter(c => c.stage === "Selected" || c.stage === "Hired").length;

  const handleViewResume = (candidate) => {
    dispatch({
      type: "LOG_RESUME_ACCESS",
      candidateName: candidate.name,
      jobId: candidate.jobId,
      actionName: "HR Viewed Private Candidate Resume",
    });
    alert(`Access Authorized: Viewing private resume for ${candidate.name}.\nAccess logged to Security Audit Trail.`);
  };

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--surface)", padding: 20, borderRadius: 14,
        border: "1px solid var(--border)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
              <Users size={20} />
            </div>
            <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              HR Recruitment Portal
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted2)", margin: 0 }}>
            Managing shortlisted candidate evaluations, interview schedules, ATS breakdowns, and hiring decisions.
          </p>
        </div>

        <div style={{
          fontSize: 12, padding: "6px 12px", borderRadius: 8, background: "var(--primary-soft)",
          color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
        }}>
          <Users size={14} /> HR Manager Active
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 600, marginBottom: 6 }}>SHORTLISTED PIPELINE</div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>{shortlisted.length}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={14} /> SCHEDULED INTERVIEWS
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{scheduledInterviews.length}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <CheckCircle2 size={14} /> SELECTED / HIRED
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>{selectedCount}</div>
        </div>
      </div>

      {/* SHORTLISTED CANDIDATES TABLE */}
      <div style={{
        background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <div style={{ padding: 18, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Shortlisted Candidates Queue ({shortlisted.length})
            </h2>
            <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Candidates forwarded by recruiters awaiting HR interview & selection.</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--border)", color: "var(--muted2)", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Candidate</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Applied Role</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>ATS Score</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Interview Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>HR Feedback</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shortlisted.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "var(--muted2)" }}>
                  No candidates shortlisted yet.
                </td>
              </tr>
            ) : (
              shortlisted.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted2)" }}>{c.email}</div>
                  </td>

                  <td style={{ padding: "14px 16px", color: "var(--ink-soft)" }}>
                    {c.jobTitle}
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    <button
                      onClick={() => setSelectedScoreCandidate(c)}
                      title="Click for full 0-100 ATS Breakdown"
                      className="font-mono"
                      style={{
                        padding: "3px 8px", borderRadius: 6, border: "none", cursor: "pointer",
                        fontWeight: 700, fontSize: 12,
                        background: c.score >= 85 ? "var(--success-soft)" : "var(--primary-soft)",
                        color: c.score >= 85 ? "var(--success)" : "var(--primary)"
                      }}>
                      {c.score}/100 Match ↗
                    </button>
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    {c.interview ? (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{c.interview.date} at {c.interview.time}</div>
                        <span style={{ fontSize: 10.5, color: "var(--info)", fontWeight: 600 }}>{c.interview.status}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11.5, color: "var(--muted2)" }}>Not Scheduled</span>
                    )}
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    {c.interviewFeedback ? (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", display: "flex", alignItems: "center", gap: 3 }}>
                          <Star size={12} fill="#D6A800" color="#D6A800" /> {c.interviewFeedback.rating}/5 — {c.interviewFeedback.verdict}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11.5, color: "var(--muted2)" }}>Pending Feedback</span>
                    )}
                  </td>

                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleViewResume(c)}
                        title="View Private Resume"
                        style={{
                          padding: "5px 8px", borderRadius: 6, border: "1px solid var(--border)",
                          background: "var(--surface)", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4
                        }}>
                        <FileText size={13} color="var(--primary)" /> Resume
                      </button>

                      <button
                        onClick={() => setSelectedScheduleCandidate(c)}
                        title="Schedule Interview"
                        style={{
                          padding: "5px 8px", borderRadius: 6, border: "1px solid var(--border)",
                          background: "var(--surface)", fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4
                        }}>
                        <Calendar size={13} color="var(--info)" /> Schedule
                      </button>

                      <button
                        onClick={() => setSelectedFeedbackCandidate(c)}
                        title="Add Interview Feedback & Selection"
                        style={{
                          padding: "5px 10px", borderRadius: 6, border: "none",
                          background: "var(--primary)", color: "#FFF", fontSize: 11.5, fontWeight: 600,
                          cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                        }}>
                        <MessageSquare size={13} /> Decision
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedScoreCandidate && (
        <AtsScoreBreakdownModal
          candidate={selectedScoreCandidate}
          job={state.jobs.find(j => j.id === selectedScoreCandidate.jobId)}
          onClose={() => setSelectedScoreCandidate(null)}
        />
      )}

      {selectedDetailCandidate && (
        <CandidateDetailModal
          candidate={selectedDetailCandidate}
          jobId={selectedDetailCandidate.jobId}
          onClose={() => setSelectedDetailCandidate(null)}
          onScheduleInterview={() => { setSelectedDetailCandidate(null); setSelectedScheduleCandidate(selectedDetailCandidate); }}
          onLaunchAssessment={() => setSelectedDetailCandidate(null)}
        />
      )}

      {selectedScheduleCandidate && (
        <ScheduleInterviewModal
          candidate={selectedScheduleCandidate}
          jobId={selectedScheduleCandidate.jobId}
          onClose={() => setSelectedScheduleCandidate(null)}
        />
      )}

      {selectedFeedbackCandidate && (
        <InterviewFeedbackModal
          candidate={selectedFeedbackCandidate}
          jobId={selectedFeedbackCandidate.jobId}
          onClose={() => setSelectedFeedbackCandidate(null)}
        />
      )}
    </div>
  );
}
