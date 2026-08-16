import React from "react";
import { X, Award, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export function AtsScoreBreakdownModal({ candidate, job, onClose }) {
  const breakdown = candidate.atsBreakdown || {
    skillsScore: 34,
    expScore: 20,
    eduScore: 13,
    keywordScore: 10,
    reqScore: 8,
  };

  const totalScore = candidate.score || 85;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,17,23,.65)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 110, padding: 20
    }}>
      <div className="atlas-fade-in" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "90vh",
        overflowY: "auto", padding: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Award size={18} />
              </div>
              <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                ATS Match Score Analysis
              </h2>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted2)", margin: "4px 0 0 0" }}>
              Evaluating <strong>{candidate.name}</strong> for <strong>{job?.title || "Role"}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Overall Score Header Card */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--paper)", padding: 18, borderRadius: 12, border: "1px solid var(--border-strong)",
          marginBottom: 20
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase" }}>OVERALL ATS MATCH RATING</div>
            <div className="font-display" style={{ fontSize: 26, fontWeight: 700, color: totalScore >= 80 ? "var(--success)" : "var(--primary)", marginTop: 2 }}>
              {totalScore} / 100
            </div>
            <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>
              {totalScore >= 85 ? "Top Rank Candidate — Strongly Recommended" : "Suitable Candidate — Good Match"}
            </div>
          </div>

          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            border: `4px solid ${totalScore >= 80 ? "var(--success)" : "var(--primary)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "var(--ink)", background: "var(--surface)"
          }}>
            {totalScore}%
          </div>
        </div>

        {/* Weighted 100% Breakdown Progress Bars */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 16, borderRadius: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>
            Weighted Match Score Criteria (0–100)
          </div>

          {/* 1. Skills Match (40%) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Skills Match (40% Weight)</span>
              <span className="font-mono" style={{ fontWeight: 700, color: "var(--primary)" }}>{breakdown.skillsScore} / 40 pts</span>
            </div>
            <div style={{ height: 6, background: "var(--paper)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(breakdown.skillsScore / 40) * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} />
            </div>
          </div>

          {/* 2. Experience Match (25%) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Experience Match (25% Weight)</span>
              <span className="font-mono" style={{ fontWeight: 700, color: "var(--info)" }}>{breakdown.expScore} / 25 pts</span>
            </div>
            <div style={{ height: 6, background: "var(--paper)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(breakdown.expScore / 25) * 100}%`, height: "100%", background: "var(--info)", borderRadius: 3 }} />
            </div>
          </div>

          {/* 3. Education Match (15%) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Education & Qualification (15% Weight)</span>
              <span className="font-mono" style={{ fontWeight: 700, color: "#7A57C4" }}>{breakdown.eduScore} / 15 pts</span>
            </div>
            <div style={{ height: 6, background: "var(--paper)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(breakdown.eduScore / 15) * 100}%`, height: "100%", background: "#7A57C4", borderRadius: 3 }} />
            </div>
          </div>

          {/* 4. Keyword Match (10%) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Keyword & Domain Fit (10% Weight)</span>
              <span className="font-mono" style={{ fontWeight: 700, color: "var(--accent)" }}>{breakdown.keywordScore} / 10 pts</span>
            </div>
            <div style={{ height: 6, background: "var(--paper)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(breakdown.keywordScore / 10) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 3 }} />
            </div>
          </div>

          {/* 5. Requirements Fit (10%) */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>Role Requirements Fit (10% Weight)</span>
              <span className="font-mono" style={{ fontWeight: 700, color: "var(--success)" }}>{breakdown.reqScore} / 10 pts</span>
            </div>
            <div style={{ height: 6, background: "var(--paper)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${(breakdown.reqScore / 10) * 100}%`, height: "100%", background: "var(--success)", borderRadius: 3 }} />
            </div>
          </div>
        </div>

        {/* Strong vs Missing Lists */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--success)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <CheckCircle2 size={13} /> STRONG MATCHES
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(candidate.strongMatches || job?.requirements || []).map((m, i) => (
                <div key={i} style={{ fontSize: 11.5, color: "var(--ink-soft)", background: "var(--success-soft)", padding: "4px 8px", borderRadius: 6 }}>
                  ✓ {m}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={13} /> MISSING / GAPS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(candidate.missingRequirements && candidate.missingRequirements.length > 0 ? candidate.missingRequirements : ["None"]).map((m, i) => (
                <div key={i} style={{ fontSize: 11.5, color: "var(--ink-soft)", background: "var(--accent-soft)", padding: "4px 8px", borderRadius: 6 }}>
                  ! {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Non-discrimination compliance notice */}
        <div style={{
          fontSize: 11, color: "var(--muted2)", background: "var(--paper)",
          padding: "8px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6, marginBottom: 16
        }}>
          <ShieldCheck size={14} color="var(--success)" />
          <span><strong>Compliance Notice:</strong> Score computed solely on skills, experience, and job requirements. No protected demographic traits used.</span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px", borderRadius: 8, border: "none",
              background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
