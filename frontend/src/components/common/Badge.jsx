import React from "react";

export function Badge({ children, tone = "default" }) {
  const tones = {
    default: { bg: "var(--paper)", fg: "var(--ink-soft)", bd: "var(--border-strong)" },
    primary: { bg: "var(--primary-soft)", fg: "var(--primary)", bd: "transparent" },
    success: { bg: "var(--success-soft)", fg: "var(--success)", bd: "transparent" },
    danger:  { bg: "var(--danger-soft)", fg: "var(--danger)", bd: "transparent" },
  };
  const t = tones[tone] || tones.default;
  return (
    <span className="font-mono" style={{
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      fontSize: 11, padding: "3px 8px", borderRadius: 999, letterSpacing: ".02em",
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}
