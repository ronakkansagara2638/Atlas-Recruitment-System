import React, { useState } from "react";
import { Mail, ArrowLeft, ArrowRight, XCircle, Sparkles, Calendar, Award } from "lucide-react";
import { Card } from "../common/Card";
import { useStore } from "../../context/StoreContext";
import { can, nextStage, prevStage } from "../../constants/recruitmentData";
import { CandidateDetailModal } from "../modals/CandidateDetailModal";
import { ScheduleInterviewModal } from "../modals/ScheduleInterviewModal";
import { AiInterviewModal } from "../modals/AiInterviewModal";

const iconBtnStyle = {
  border: "1px solid var(--border-strong)", background: "var(--surface)", borderRadius: 6,
  padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11,
};

export function CandidateCard({ candidate, jobId, role, rank }) {
  const { dispatch } = useStore();
  const [showDetail, setShowDetail] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  const nxt = nextStage(candidate.stage);
  const prv = prevStage(candidate.stage);
  const closedOut = candidate.stage === "Hired" || candidate.stage === "Rejected";

  const allowed = can(role, "move_stage_any") ||
    (can(role, "move_stage_interview_offer") && ["Interview", "Offer"].includes(candidate.stage));

  return (
    <>
      <Card style={{ padding: 13, border: rank === 1 ? "1.5 solid var(--primary)" : undefined }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ cursor: "pointer" }} onClick={() => setShowDetail(true)}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {rank && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 5px", borderRadius: 4,
                  background: rank === 1 ? "var(--primary)" : "var(--paper)",
                  color: rank === 1 ? "#FFF" : "var(--muted2)"
                }}>
                  #{rank}
                </span>
              )}
              <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>{candidate.name}</span>
            </div>

            <div style={{ fontSize: 11.5, color: "var(--muted2)", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
              <Mail size={11} />{candidate.email}
            </div>
          </div>

          {candidate.score != null && (
            <span
              onClick={() => setShowDetail(true)}
              title="Click for AI Match Score Breakdown"
              className="font-mono"
              style={{
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                padding: "2px 6px", borderRadius: 6,
                background: candidate.score >= 85 ? "var(--success-soft)" : "var(--primary-soft)",
                color: candidate.score >= 85 ? "var(--success)" : "var(--primary)"
              }}>
              {candidate.score}% Match
            </span>
          )}
        </div>

        {/* Skill match tag preview */}
        {candidate.strongMatches && candidate.strongMatches.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
            {candidate.strongMatches.slice(0, 2).map((sk, i) => (
              <span key={i} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "var(--paper)", color: "var(--ink-soft)" }}>
                ✓ {sk}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div style={{ fontSize: 10.5, color: "var(--muted2)" }}>
            Applied {candidate.appliedAt === 0 ? "today" : `${candidate.appliedAt}d ago`}
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setShowSchedule(true)}
              title="Schedule Interview"
              style={{ ...iconBtnStyle, padding: "3px 6px" }}>
              <Calendar size={12} color="var(--primary)" />
            </button>
            <button
              onClick={() => setShowDetail(true)}
              title="AI Recruiter Brief"
              style={{ ...iconBtnStyle, padding: "3px 6px", background: "var(--primary-soft)", color: "var(--primary)" }}>
              <Sparkles size={12} />
            </button>
          </div>
        </div>

        {!closedOut && allowed && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
            {prv && (
              <button onClick={() => dispatch({ type: "MOVE_CANDIDATE", jobId, candidateId: candidate.id, stage: prv })}
                title={`Back to ${prv}`} style={iconBtnStyle}>
                <ArrowLeft size={12} />
              </button>
            )}
            {nxt && (
              <button onClick={() => dispatch({ type: "MOVE_CANDIDATE", jobId, candidateId: candidate.id, stage: nxt })}
                style={{ ...iconBtnStyle, flex: 1, background: "var(--primary-soft)", color: "var(--primary)", justifyContent: "center", fontWeight: 600, fontSize: 11 }}>
                Advance to {nxt} <ArrowRight size={12} />
              </button>
            )}
            <button onClick={() => dispatch({ type: "MOVE_CANDIDATE", jobId, candidateId: candidate.id, stage: "Rejected" })}
              title="Reject" style={{ ...iconBtnStyle, color: "var(--danger)" }}>
              <XCircle size={12} />
            </button>
          </div>
        )}
      </Card>

      {showDetail && (
        <CandidateDetailModal
          candidate={candidate}
          jobId={jobId}
          onClose={() => setShowDetail(false)}
          onScheduleInterview={() => { setShowDetail(false); setShowSchedule(true); }}
          onLaunchAssessment={() => { setShowDetail(false); setShowAssessment(true); }}
        />
      )}

      {showSchedule && (
        <ScheduleInterviewModal
          candidate={candidate}
          jobId={jobId}
          onClose={() => setShowSchedule(false)}
        />
      )}

      {showAssessment && (
        <AiInterviewModal
          candidate={candidate}
          jobId={jobId}
          onClose={() => setShowAssessment(false)}
        />
      )}
    </>
  );
}
