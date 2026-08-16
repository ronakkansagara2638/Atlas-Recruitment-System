import React, { useState } from "react";
import { LogOut, User, Shield, Briefcase, Users, ChevronDown, Check, Sparkles } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { ROLES } from "../../constants/recruitmentData";

export function UserMenu() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);

  const currentUser = state.user || {
    name: "Guest User",
    email: "guest@atlas.hrms",
    role: state.role || "candidate",
  };

  const currentRole = ROLES[state.role] || ROLES.candidate;
  const RoleIcon = currentRole.icon || User;

  // Extract initials
  const initials = currentUser.name
    ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    setOpen(false);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="atlas-focus"
        style={{
          display: "flex", alignItems: "center", gap: 9, padding: "5px 10px 5px 6px",
          borderRadius: 20, border: "1px solid var(--border-strong)", background: "var(--surface)",
          cursor: "pointer", fontSize: 13, transition: "all 0.2s ease"
        }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", background: "var(--primary)",
          color: "#FFF", fontWeight: 700, fontSize: 11, display: "flex",
          alignItems: "center", justifyContent: "center"
        }}>
          {initials}
        </div>

        <div style={{ textAlign: "left", lineHeight: 1.2 }}>
          <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--ink)" }}>
            {currentUser.name}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted2)", display: "flex", alignItems: "center", gap: 3 }}>
            <RoleIcon size={10} color="var(--primary)" />
            {currentRole.label}
          </div>
        </div>

        <ChevronDown size={14} color="var(--muted2)" style={{ marginLeft: 2 }} />
      </button>

      {open && (
        <div className="atlas-fade-in" style={{
          position: "absolute", right: 0, top: "115%", background: "var(--surface)",
          border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 16px 36px rgba(20,22,31,.15)",
          width: 240, zIndex: 50, overflow: "hidden"
        }}>
          {/* User Header Details */}
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "var(--paper)" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted2)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser.email}
            </div>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px",
              borderRadius: 6, fontSize: 11, fontWeight: 600, background: "var(--primary-soft)",
              color: "var(--primary)"
            }}>
              <RoleIcon size={11} /> {currentRole.label}
              {currentUser.isMaster && " (Master Admin)"}
            </span>
          </div>

          {/* Log Out Action */}
          <div style={{ padding: 8, borderTop: "1px solid var(--border)" }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px",
                borderRadius: 8, border: "none", background: "var(--danger-soft)", color: "var(--danger)",
                cursor: "pointer", fontSize: 12.5, fontWeight: 600, transition: "background 0.2s"
              }}>
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
