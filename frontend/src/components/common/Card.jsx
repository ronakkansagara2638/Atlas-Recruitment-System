import React from "react";

export function Card({ children, style, className = "" }) {
  return (
    <div className={className} style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, ...style,
    }}>{children}</div>
  );
}
