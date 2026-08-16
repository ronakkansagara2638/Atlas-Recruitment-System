import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { ROLES } from "../../constants/recruitmentData";

export function RoleSwitcher() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const Current = ROLES[state.role].icon;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} className="atlas-focus" style={{
        display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
        borderRadius: 9, border: "1px solid var(--border-strong)", background: "var(--surface)",
        cursor: "pointer", fontSize: 13,
      }}>
        <Current size={14} color="var(--primary)" />
        <span style={{ fontWeight: 600 }}>{ROLES[state.role].label}</span>
        <ChevronDown size={14} color="var(--muted2)" />
      </button>
      {open && (
        <div className="atlas-fade-in" style={{
          position: "absolute", right: 0, top: "110%", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 10, boxShadow: "0 14px 32px rgba(20,22,31,.12)",
          width: 210, zIndex: 40, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 12px", fontSize: 10.5, color: "var(--muted2)", borderBottom: "1px solid var(--border)" }}>
            VIEWING AS — demo role switch
          </div>
          {Object.entries(ROLES).map(([key, r]) => {
            const Icon = r.icon;
            return (
              <button key={key} onClick={() => { dispatch({ type: "SET_ROLE", role: key }); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 12px",
                  border: "none", background: state.role === key ? "var(--paper)" : "transparent",
                  cursor: "pointer", fontSize: 13, textAlign: "left",
                }}>
                <Icon size={14} color={state.role === key ? "var(--primary)" : "var(--muted2)"} />
                {r.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
