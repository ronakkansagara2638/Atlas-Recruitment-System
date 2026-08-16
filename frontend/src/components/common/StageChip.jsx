import React from "react";
import { STAGE_STYLE } from "../../constants/recruitmentData";

export function StageChip({ stage }) {
  const s = STAGE_STYLE[stage] || { bg: "#eee", fg: "#333" };
  return (
    <span style={{
      background: s.bg, color: s.fg, fontSize: 12, fontWeight: 600,
      padding: "4px 10px", borderRadius: 999, display: "inline-block",
    }}>{stage}</span>
  );
}
