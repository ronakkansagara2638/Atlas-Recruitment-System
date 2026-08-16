import React from "react";
import { Card } from "../common/Card";

export function KpiCard({ label, value, sub, icon: Icon, tone }) {
  return (
    <Card style={{ padding: 18, flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 600 }}>{label}</div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: tone.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color={tone.fg} />
        </div>
      </div>
      <div className="font-display" style={{ fontSize: 26, fontWeight: 700, marginTop: 10 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--muted2)", marginTop: 3 }}>{sub}</div>}
    </Card>
  );
}
