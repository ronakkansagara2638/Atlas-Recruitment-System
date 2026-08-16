import React from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { can } from "../../constants/recruitmentData";
import { UserMenu } from "./UserMenu";

export function Header({ view }) {
  const { state } = useStore();
  const titleFor = {
    dashboard: "Dashboard",
    hr_dashboard: "HR Recruitment Portal",
    candidate_dashboard: "Candidate Career Portal",
    jobs: "Job Postings",
    job_detail: "Pipeline & ATS",
    open_jobs: "Browse Jobs",
    my_applications: "My Applications",
    analytics: "Analytics Overview",
    users: "User & Role Management",
    audit_logs: "Security Audit Logs",
    notifications: "System Notifications",
  };

  return (
    <header style={{
      height: 60, borderBottom: "1px solid var(--border)", display: "flex",
      alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0,
      background: "var(--surface)",
    }}>
      <div style={{ fontSize: 12.5, color: "var(--muted2)", display: "flex", alignItems: "center", gap: 6 }}>
        Atlas ATS <ChevronRight size={12} /> <span style={{ color: "var(--ink)", fontWeight: 600 }}>{titleFor[view] || "Portal"}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {can(state.role, "generate_jd") && (
          <span style={{ fontSize: 11, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
            <Sparkles size={12} /> AI JD Enabled
          </span>
        )}
        <UserMenu />
      </div>
    </header>
  );
}

