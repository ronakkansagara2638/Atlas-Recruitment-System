import React from "react";
import { STAGES, STAGE_STYLE } from "../../constants/recruitmentData";

export function PipelineFunnel({ candidates, compact = false }) {
  const total = candidates.length || 1;
  const counts = STAGES.map(s => ({ stage: s, n: candidates.filter(c => c.stage === s).length }));
  const hired = counts.find(c => c.stage === "Hired").n;
  const rejected = counts.find(c => c.stage === "Rejected").n;
  const closedOut = hired + rejected;
  const rate = candidates.length ? Math.round((hired / candidates.length) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", height: compact ? 8 : 12, borderRadius: 999, overflow: "hidden", background: "var(--paper)" }}>
        {counts.map(({ stage, n }) => n === 0 ? null : (
          <div key={stage} title={`${stage}: ${n}`}
            style={{ width: `${(n / total) * 100}%`, background: STAGE_STYLE[stage].bar }} />
        ))}
      </div>
      {!compact && (
        <div className="font-mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted2)" }}>
          <span>{candidates.length} in pipeline · {closedOut} closed out</span>
          <span style={{ color: "var(--success)", fontWeight: 600 }}>{rate}% hire rate</span>
        </div>
      )}
    </div>
  );
}
