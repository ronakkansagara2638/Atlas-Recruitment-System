import React, { useState } from "react";
import { ChevronRight, UploadCloud, Sparkles } from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { StageChip } from "../components/common/StageChip";
import { PipelineFunnel } from "../components/common/PipelineFunnel";
import { EmptyState } from "../components/common/EmptyState";
import { CandidateCard } from "../components/cards/CandidateCard";
import { ResumeUploadModal } from "../components/modals/ResumeUploadModal";
import { useStore } from "../context/StoreContext";
import { STAGES } from "../constants/recruitmentData";

export function JobDetailView({ setView }) {
  const { state } = useStore();
  const [showUpload, setShowUpload] = useState(false);

  const job = state.jobs.find(j => j.id === state.selectedJobId);
  if (!job) return <EmptyState text="Select a job from the list." />;

  // Compute AI Match Ranks across candidates in this job
  const sortedCandidates = [...job.candidates].sort((a, b) => (b.score || 0) - (a.score || 0));
  const rankMap = new Map();
  sortedCandidates.forEach((c, idx) => rankMap.set(c.id, idx + 1));

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setView("jobs")} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: "var(--muted2)", fontSize: 12.5, fontWeight: 600, padding: 0 }}>
          <ChevronRight size={13} style={{ transform: "rotate(180deg)" }} /> All roles
        </button>

        <Button icon={UploadCloud} onClick={() => setShowUpload(true)}>
          Upload & Parse Resume
        </Button>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{job.title}</div>
          <Badge tone={job.status === "Published" ? "success" : "default"}>{job.status}</Badge>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12.5, color: "var(--muted2)" }}>
          <span>{job.department}</span>·<span>{job.level}</span>·<span>{job.location}</span>
        </div>
      </div>

      <Card style={{ padding: 18 }}>
        <PipelineFunnel candidates={job.candidates} />
      </Card>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Card style={{ padding: 18, flex: "1 1 320px" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>Role summary</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", whiteSpace: "pre-line", lineHeight: 1.55 }}>{job.description}</div>
        </Card>
        <Card style={{ padding: 18, flex: "1 1 260px" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>Requirements</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
            {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </Card>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <div className="font-display" style={{ fontSize: 15, fontWeight: 700 }}>Pipeline Board (AI Match Ranked)</div>
        <div style={{ fontSize: 11.5, color: "var(--muted2)", display: "flex", alignItems: "center", gap: 4 }}>
          <Sparkles size={12} color="var(--primary)" /> Candidates ranked by AI Match Score
        </div>
      </div>

      <div className="atlas-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
        {STAGES.map(stage => {
          const items = job.candidates.filter(c => c.stage === stage);
          return (
            <div key={stage} style={{ minWidth: 230, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <StageChip stage={stage} />
                <span className="font-mono" style={{ fontSize: 11, color: "var(--muted2)" }}>{items.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map(c => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    jobId={job.id}
                    role={state.role}
                    rank={rankMap.get(c.id)}
                  />
                ))}
                {items.length === 0 && (
                  <div style={{ fontSize: 11.5, color: "var(--muted2)", padding: "10px 4px" }}>No candidates here.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showUpload && (
        <ResumeUploadModal
          defaultJobId={job.id}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}
