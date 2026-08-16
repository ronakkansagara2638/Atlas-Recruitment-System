import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Card } from "../components/common/Card";
import { StageChip } from "../components/common/StageChip";
import { useStore } from "../context/StoreContext";
import { STAGES, STAGE_STYLE } from "../constants/recruitmentData";

export function AnalyticsView() {
  const { state } = useStore();
  const all = state.jobs.flatMap(j => j.candidates);
  const byStage = STAGES.map(s => ({ stage: s, n: all.filter(c => c.stage === s).length }));
  const byDept = Object.entries(
    state.jobs.reduce((acc, j) => { acc[j.department] = (acc[j.department] || 0) + j.candidates.length; return acc; }, {})
  ).map(([name, candidates]) => ({ name, candidates }));

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Analytics</div>

      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>Candidates by stage — all roles</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {byStage.map(({ stage, n }) => (
            <div key={stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 90 }}><StageChip stage={stage} /></div>
              <div style={{ flex: 1, background: "var(--paper)", borderRadius: 999, height: 10, overflow: "hidden" }}>
                <div style={{ width: `${all.length ? (n / all.length) * 100 : 0}%`, height: "100%", background: STAGE_STYLE[stage].bar }} />
              </div>
              <div className="font-mono" style={{ width: 24, textAlign: "right", fontSize: 12, color: "var(--muted2)" }}>{n}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 12 }}>Candidates by department</div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byDept} margin={{ left: -20 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted2)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} cursor={{ fill: "var(--paper)" }} />
              <Bar dataKey="candidates" radius={[6, 6, 0, 0]}>
                {byDept.map((_, i) => <Cell key={i} fill="var(--accent)" fillOpacity={0.9} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
