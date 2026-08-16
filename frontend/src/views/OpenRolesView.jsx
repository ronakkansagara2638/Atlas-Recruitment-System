import React, { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useStore } from "../context/StoreContext";
import { ApplyJobModal } from "../components/modals/ApplyJobModal";

export function OpenRolesView() {
  const { state, dispatch } = useStore();
  const [applyJob, setApplyJob] = useState(null);

  const openJobs = state.jobs.filter(j => j.status === "Published");
  const myEmail = state.user?.email;

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Open roles</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {openJobs.map(j => {
          const applied = myEmail && j.candidates.some(c => c.email.toLowerCase() === myEmail.toLowerCase());
          return (
            <Card key={j.id} style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{j.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 4 }}>{j.department} · {j.location} · {j.level}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 8, maxWidth: 460 }}>{j.description}</div>
              </div>
              <Button variant={applied ? "outline" : "primary"} disabled={applied}
                icon={applied ? CheckCircle2 : ArrowRight}
                onClick={() => setApplyJob(j)}>
                {applied ? "Applied" : "Apply now"}
              </Button>
            </Card>
          );
        })}
        {openJobs.length === 0 && (
          <div style={{ fontSize: 12.5, color: "var(--muted2)", padding: "20px 4px" }}>No open roles right now — check back soon.</div>
        )}
      </div>

      {applyJob && (
        <ApplyJobModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}
    </div>
  );
}
