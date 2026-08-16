import React from "react";
import { Card } from "../components/common/Card";
import { StageChip } from "../components/common/StageChip";
import { EmptyState } from "../components/common/EmptyState";
import { useStore } from "../context/StoreContext";
import { STAGE_STYLE } from "../constants/recruitmentData";

export function MyApplicationsView() {
  const { state } = useStore();
  const myEmail = (state.user?.email || "").toLowerCase();
  const myName = (state.user?.name || "").toLowerCase();
  const mine = state.jobs
    .map(j => ({
      job: j,
      candidate: j.candidates.find(c =>
        (c.email && myEmail && c.email.toLowerCase() === myEmail) ||
        (c.name && myName && c.name.toLowerCase() === myName) ||
        c.isSessionCandidate
      )
    }))
    .filter(x => x.candidate);

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>My applications</div>
      {mine.length === 0 && <EmptyState text="You haven't applied to any roles yet — check Open Roles." />}
      {mine.map(({ job, candidate }) => (
        <Card key={job.id} style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{job.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 3 }}>{job.department} · {job.location}</div>
            </div>
            <StageChip stage={candidate.stage} />
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
            {["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Hired"].map((s, i, arr) => {
              const reached = arr.indexOf(candidate.stage) >= i && candidate.stage !== "Rejected";
              return (
                <div key={s} style={{
                  flex: 1, height: 5, borderRadius: 4,
                  background: reached ? STAGE_STYLE[s].bar : "var(--border)",
                }} title={s} />
              );
            })}
          </div>

          {/* Structured application detail block */}
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700 }}>ATS Score</div>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", marginTop: 2 }}>{candidate.score}%</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700 }}>Experience</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{candidate.experienceYears} yrs</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700 }}>Education</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{candidate.education}</div>
            </div>
            {candidate.resumeFileName && (
              <div>
                <div style={{ fontSize: 10.5, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700 }}>Resume</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{candidate.resumeFileName}</div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
