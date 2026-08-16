import React, { useState } from "react";
import { User, Briefcase, Calendar, Video, CheckCircle2, Clock, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { STAGE_STYLE } from "../constants/recruitmentData";

export function CandidateDashboardView({ setView }) {
  const { state, dispatch } = useStore();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const currentUser = state.user || { name: "Candidate", email: "candidate@atlas.hrms" };

  // Find candidate applications across all jobs matching candidate email or name
  const myApplications = state.jobs.flatMap(j => 
    j.candidates
      .filter(c => 
        (c.email && currentUser.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (c.name && currentUser.name && c.name.toLowerCase() === currentUser.name.toLowerCase()) ||
        c.isSessionCandidate
      )
      .map(c => ({ ...c, jobTitle: j.title, company: j.company, department: j.department, jobId: j.id }))
  );

  const myInterviews = myApplications.filter(c => c.interview && c.interview.date);

  const publishedJobs = state.jobs.filter(j => j.status === "Published");

  const handleWithdraw = (jobId) => {
    if (window.confirm("Are you sure you want to withdraw your application?")) {
      dispatch({
        type: "WITHDRAW_APPLICATION",
        jobId,
        candidateEmail: currentUser.email,
      });
    }
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
            <div style={{ padding: 6, borderRadius: 8, background: "var(--success-soft)", color: "var(--success)" }}>
              <User size={20} />
            </div>
            <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              Candidate Career Portal
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted2)", margin: 0 }}>
            Welcome, <strong>{currentUser.name}</strong> ({currentUser.email}). Track your active job applications and interview schedules.
          </p>
        </div>

        <button
          onClick={() => setView("open_jobs")}
          style={{
            padding: "9px 16px", borderRadius: 9, border: "none",
            background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 14px rgba(52,54,142,0.3)"
          }}>
          <Briefcase size={16} /> Browse Open Positions
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 600, marginBottom: 6 }}>ACTIVE APPLICATIONS</div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>{myApplications.length}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={14} /> UPCOMING INTERVIEWS
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{myInterviews.length}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Briefcase size={14} /> PUBLISHED JOBS
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>{publishedJobs.length}</div>
        </div>
      </div>

      {/* MY APPLICATIONS TRACKER */}
      <div style={{
        background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <div style={{ padding: 18, borderBottom: "1px solid var(--border)" }}>
          <h2 className="font-display" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            My Active Applications ({myApplications.length})
          </h2>
          <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Real-time status updates from recruiters and HR managers.</div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--border)", color: "var(--muted2)", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Applied Role</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Department</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Application Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Interview Details</th>
              <th style={{ padding: "12px 16px", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myApplications.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--muted2)" }}>
                  You haven't submitted any job applications yet. Click <strong>Browse Open Positions</strong> to explore active job openings!
                </td>
              </tr>
            ) : (
              myApplications.map((app) => {
                const stageStyle = STAGE_STYLE[app.stage] || STAGE_STYLE.Applied;
                return (
                  <tr key={app.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "var(--ink)" }}>{app.jobTitle}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted2)" }}>{app.company || "Atlas Technologies"}</div>
                    </td>

                    <td style={{ padding: "14px 16px", color: "var(--ink-soft)" }}>
                      {app.department}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span style={{
                          display: "inline-block", padding: "4px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
                          background: stageStyle.bg, color: stageStyle.fg, alignSelf: "flex-start"
                        }}>
                          {app.stage}
                        </span>
                        {/* Stage Progress Stepper */}
                        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4 }}>
                          {["Applied", "Shortlisted", "Interview Scheduled", "Hired"].map((st, i) => {
                            const stagesOrder = ["Applied", "Under Review", "Shortlisted", "HR Review", "Interview Scheduled", "Interview Completed", "Selected", "Hired"];
                            const currentIdx = stagesOrder.indexOf(app.stage);
                            const stIdx = stagesOrder.indexOf(st);
                            const isDone = currentIdx >= stIdx;
                            return (
                              <React.Fragment key={st}>
                                <div
                                  title={st}
                                  style={{
                                    width: 16, height: 16, borderRadius: "50%",
                                    background: isDone ? "var(--primary)" : "var(--border)",
                                    color: "#FFF", fontSize: 9, fontWeight: 700,
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                  }}>
                                  {isDone ? "✓" : i + 1}
                                </div>
                                {i < 3 && <div style={{ flex: 1, height: 2, background: isDone ? "var(--primary)" : "var(--border)" }} />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      {app.interview ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{app.interview.date} at {app.interview.time}</div>
                          {app.interview.meetUrl && (
                            <a href={app.interview.meetUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: "var(--info)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                              <Video size={12} /> Join Google Meet
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: 11.5, color: "var(--muted2)" }}>No interview scheduled</span>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => handleWithdraw(app.jobId)}
                        title="Withdraw Application"
                        style={{
                          padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)",
                          background: "var(--danger-soft)", color: "var(--danger)", fontSize: 11.5,
                          fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
                        }}>
                        <Trash2 size={13} /> Withdraw
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
