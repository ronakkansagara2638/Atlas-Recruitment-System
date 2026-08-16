import React, { useState } from "react";
import { X, Mail, Calendar, Sparkles, CheckCircle2, AlertCircle, Award, Video, ArrowRight, BrainCircuit, FileText, GraduationCap, Briefcase } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { STAGE_STYLE } from "../../constants/recruitmentData";

export function CandidateDetailModal({ candidate, jobId, onClose, onScheduleInterview, onLaunchAssessment }) {
  const { state, dispatch } = useStore();
  const job = state.jobs.find(j => j.id === jobId);

  const stageStyle = STAGE_STYLE[candidate.stage] || STAGE_STYLE.Applied;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,17,23,.65)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: 20
    }}>
      <div className="atlas-fade-in" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, width: "100%", maxWidth: 680, maxHeight: "90vh",
        overflowY: "auto", padding: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: "var(--primary-soft)",
              color: "var(--primary)", fontWeight: 700, fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center"
            }}>
              {candidate.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                  {candidate.name}
                </h2>
                <span style={{
                  padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: stageStyle.bg, color: stageStyle.fg
                }}>
                  {candidate.stage}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted2)", marginTop: 2, display: "flex", alignItems: "center", gap: 10 }}>
                <span><Mail size={12} style={{ display: "inline", marginRight: 4 }} />{candidate.email}</span>
                <span>• {job?.title || "Job Posting"}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Structured Application Details: ATS score, experience, education, resume */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12,
          background: "var(--paper)", padding: 14,
          borderRadius: 12, border: "1px solid var(--border)", marginBottom: 14
        }}>
          <div style={{ borderRight: "1px solid var(--border)", paddingRight: 12 }}>
            <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700 }}>ATS SCORE</div>
            <div className="font-mono" style={{ fontSize: 18, fontWeight: 700, color: candidate.score >= 80 ? "var(--success)" : "var(--primary)", marginTop: 2 }}>
              {candidate.score}%
            </div>
          </div>

          <div style={{ borderRight: "1px solid var(--border)", paddingRight: 12 }}>
            <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <Briefcase size={11} /> EXPERIENCE
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>
              {candidate.experienceYears || 4} Years
            </div>
          </div>

          <div style={{ borderRight: "1px solid var(--border)", paddingRight: 12 }}>
            <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <GraduationCap size={11} /> EDUCATION
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {candidate.education || "B.S. Computer Science"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <FileText size={11} /> RESUME
            </div>
            {candidate.resumeFileName ? (
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--primary)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={candidate.resumeFileName}>
                {candidate.resumeFileName}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Not uploaded</div>
            )}
          </div>
        </div>

        {/* ATS Score Breakdown */}
        {candidate.atsBreakdown && (
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", marginBottom: 20,
          }}>
            {[
              ["Skills", candidate.atsBreakdown.skillsScore, 40],
              ["Experience", candidate.atsBreakdown.expScore, 25],
              ["Education", candidate.atsBreakdown.eduScore, 15],
              ["Keywords", candidate.atsBreakdown.keywordScore, 10],
              ["Req. Fit", candidate.atsBreakdown.reqScore, 10],
            ].map(([label, val, max]) => (
              <div key={label} style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                <span style={{ fontWeight: 700, color: "var(--ink)" }}>{label}</span>: {val}/{max}
              </div>
            ))}
          </div>
        )}

        {/* AI RECRUITER EXECUTIVE BRIEF */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border-strong)",
          borderRadius: 12, padding: 18, marginBottom: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, color: "var(--primary)" }}>
            <Sparkles size={16} />
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>AI Candidate Executive Brief</h3>
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6, margin: "0 0 14px 0" }}>
            {candidate.summary}
          </p>

          {/* Skill Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--success)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={13} /> MATCHED REQUIREMENTS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(candidate.strongMatches || []).map((sk, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--success-soft)", color: "var(--success)", fontWeight: 600 }}>
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <AlertCircle size={13} /> GAP AREAS / TO EVALUATE
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(candidate.missingRequirements || ["Advanced System Design"]).map((sk, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 500 }}>
                    ! {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SCHEDULED INTERVIEW & TECHNICAL ASSESSMENT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
          {/* Interview Status Card */}
          <div style={{ background: "var(--paper)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", marginBottom: 6 }}>
              SCHEDULED INTERVIEW
            </div>
            {candidate.interview ? (
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} color="var(--primary)" /> {candidate.interview.date} at {candidate.interview.time}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--muted2)", marginTop: 4 }}>With: {candidate.interview.interviewer}</div>
                {candidate.interview.meetUrl && (
                  <a href={candidate.interview.meetUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: "var(--info)", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, fontWeight: 600 }}>
                    <Video size={12} /> Join Google Meet
                  </a>
                )}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 8 }}>No interview scheduled yet.</div>
                <button
                  onClick={onScheduleInterview}
                  style={{
                    padding: "6px 10px", borderRadius: 7, border: "1px solid var(--primary)",
                    background: "var(--primary-soft)", color: "var(--primary)", fontSize: 11.5,
                    fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
                  }}>
                  <Calendar size={12} /> Schedule Interview
                </button>
              </div>
            )}
          </div>

          {/* AI Assessment Card */}
          <div style={{ background: "var(--paper)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase", marginBottom: 6 }}>
              AI TECHNICAL ASSESSMENT
            </div>
            {candidate.assessment ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--success)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Award size={16} /> {candidate.assessment.score}% Technical Score
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", marginTop: 2 }}>{candidate.assessment.verdict}</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 8 }}>No technical evaluation recorded.</div>
                <button
                  onClick={onLaunchAssessment}
                  style={{
                    padding: "6px 10px", borderRadius: 7, border: "1px solid var(--primary)",
                    background: "var(--primary-soft)", color: "var(--primary)", fontSize: 11.5,
                    fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
                  }}>
                  <BrainCircuit size={12} /> Launch AI Assessment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onScheduleInterview}
              style={{
                padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--surface)", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}>
              <Calendar size={14} /> Schedule Interview
            </button>

            <button
              onClick={onLaunchAssessment}
              style={{
                padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
                background: "var(--surface)", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}>
              <BrainCircuit size={14} /> AI Assessment
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
