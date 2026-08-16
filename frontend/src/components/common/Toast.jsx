import React, { useEffect } from "react";

export function Toast({ toast, onClear }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClear, 3200);
    return () => clearTimeout(t);
  }, [toast, onClear]);

  if (!toast) return null;
  const colors = {
    success: "var(--success)", info: "var(--info)", danger: "var(--danger)",
  };
  return (
    <div className="atlas-fade-in" style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", color: "#fff", padding: "10px 18px", borderRadius: 10,
      fontSize: 13.5, fontWeight: 500, zIndex: 100, boxShadow: "0 12px 32px rgba(0,0,0,.25)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: colors[toast.kind] || "#fff" }} />
      {toast.msg}
    </div>
  );
}
