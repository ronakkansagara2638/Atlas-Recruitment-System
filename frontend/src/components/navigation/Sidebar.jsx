import React from "react";
import { LayoutGrid, Briefcase, User, BarChart3, Shield, LogOut, Lock, Bell, Users, CheckCircle2 } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { can } from "../../constants/recruitmentData";

export function Sidebar({ view, setView }) {
  const { state, dispatch } = useStore();
  const { role } = state;

  const getItemsForRole = () => {
    if (role === "admin") {
      return [
        { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
        { key: "users", label: "User Management", icon: Shield },
        { key: "jobs", label: "Jobs Oversight", icon: Briefcase },
        { key: "analytics", label: "Analytics", icon: BarChart3 },
        { key: "audit_logs", label: "Security Audit Logs", icon: Lock },
      ];
    } else if (role === "hr") {
      return [
        { key: "hr_dashboard", label: "HR Portal & Queue", icon: Users },
        { key: "jobs", label: "All Job Postings", icon: Briefcase },
        { key: "notifications", label: "Notifications", icon: Bell },
      ];
    } else if (role === "recruiter") {
      return [
        { key: "dashboard", label: "Recruiter Dashboard", icon: LayoutGrid },
        { key: "jobs", label: "My Job Postings", icon: Briefcase },
        { key: "notifications", label: "Notifications", icon: Bell },
      ];
    } else {
      // Candidate
      return [
        { key: "candidate_dashboard", label: "Candidate Portal", icon: User },
        { key: "open_jobs", label: "Browse Jobs", icon: Briefcase },
        { key: "my_applications", label: "My Applications", icon: CheckCircle2 },
        { key: "notifications", label: "Notifications", icon: Bell },
      ];
    }
  };

  const items = getItemsForRole();

  return (
    <aside style={{
      width: 236, flexShrink: 0, borderRight: "1px solid var(--border)",
      background: "var(--surface)", display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      <div style={{ padding: "22px 20px 18px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Briefcase size={16} color="#fff" />
        </div>
        <div className="font-display" style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-.01em" }}>Atlas ATS</div>
      </div>

      <nav style={{ padding: "6px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(({ key, label, icon: Icon }) => {
          const active = view === key;
          return (
            <button key={key} onClick={() => setView(key)} className="atlas-focus"
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderRadius: 9, border: "none", cursor: "pointer", textAlign: "left",
                background: active ? "var(--primary-soft)" : "transparent",
                color: active ? "var(--primary)" : "var(--ink-soft)",
                fontWeight: active ? 600 : 500, fontSize: 13.5,
              }}>
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={() => dispatch({ type: "LOGOUT" })}
          style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px",
            borderRadius: 8, border: "none", background: "var(--danger-soft)", color: "var(--danger)",
            cursor: "pointer", fontSize: 12.5, fontWeight: 600
          }}>
          <LogOut size={15} /> Log Out
        </button>

        <div className="font-mono" style={{ fontSize: 10, color: "var(--muted2)", lineHeight: 1.5 }}>
          Atlas Recruitment Platform • 4-Role RBAC System
        </div>
      </div>
    </aside>
  );
}
