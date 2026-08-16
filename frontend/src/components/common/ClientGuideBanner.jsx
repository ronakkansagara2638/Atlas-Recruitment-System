import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, User, Briefcase, Users, Shield } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export function ClientGuideBanner({ view }) {
  const { state } = useStore();
  const [expanded, setExpanded] = useState(true);

  const guideContent = {
    dashboard: {
      title: "Recruiter Dashboard & AI Match Overview",
      role: "Recruiter Perspective",
      icon: Briefcase,
      color: "#3B82F6",
      summary: "Recruiters use this central hub to post open jobs, track candidate pipelines, and review automated AI resume scores.",
      tips: [
        "Click 'Post a Role' to test creating a job listing with automated AI job descriptions.",
        "Click 'AI Resume Upload' to upload a sample resume and view instant candidate scoring.",
        "Click 'View Brief' on any candidate to inspect their detailed ATS score breakdown.",
      ],
    },
    hr_dashboard: {
      title: "HR Portal & Interview Feedback Queue",
      role: "HR Manager Perspective",
      icon: Users,
      color: "#8B5CF6",
      summary: "HR Managers evaluate shortlisted candidates forwarded by recruiters, schedule video interviews, and record hiring decisions.",
      tips: [
        "Click 'Schedule Interview' to book a mock candidate interview with Google Meet integration.",
        "Click 'ATS Score' to view the candidate's detailed skill and experience breakdown.",
        "Click 'Feedback' to record interview notes and issue final hiring offers.",
      ],
    },
    candidate_dashboard: {
      title: "Candidate Career & Application Portal",
      role: "Candidate Perspective",
      icon: User,
      color: "#10B981",
      summary: "Candidates browse available job openings, submit applications, and track their application progress step-by-step.",
      tips: [
        "Click 'Submit New Application' to test applying to active job roles.",
        "Watch your real-time status update automatically as HR/Recruiters process your file.",
        "Access video interview links when an interview is scheduled.",
      ],
    },
    open_jobs: {
      title: "Browse Open Career Opportunities",
      role: "Candidate / Public View",
      icon: User,
      color: "#10B981",
      summary: "List of all published positions currently open for candidate applications.",
      tips: [
        "Filter job openings by department or search keywords.",
        "Click 'Apply Now' to test the 1-click candidate application flow.",
      ],
    },
    jobs: {
      title: "Jobs Oversight & Posting Directory",
      role: "Recruiter & Admin View",
      icon: Briefcase,
      color: "#3B82F6",
      summary: "Manage all draft, active, and closed job postings across departments.",
      tips: [
        "Click any job card to inspect candidate pipelines for that position.",
        "Use stage filter tabs to filter roles by status.",
      ],
    },
    users: {
      title: "User Management & Role Permissions",
      role: "Master Admin Perspective",
      icon: Shield,
      color: "#F59E0B",
      summary: "Admins assign platform roles (Candidate, Recruiter, HR, Admin) and control team access.",
      tips: [
        "Change any user's role using the role dropdown.",
        "View active system users and permission scopes.",
      ],
    },
    audit_logs: {
      title: "Security & Action Audit Logs",
      role: "Compliance & Security Trail",
      icon: Shield,
      color: "#EF4444",
      summary: "Real-time human-readable event log tracking sensitive actions like resume views and stage changes.",
      tips: [
        "Filter activity logs by event type or user.",
        "Verify security compliance and data access audit trails.",
      ],
    },
  };

  const currentInfo = guideContent[view] || guideContent.dashboard;
  const RoleIcon = currentInfo.icon;

  return (
    <div style={{
      background: "var(--surface)", border: `1px solid ${currentInfo.color}40`,
      borderRadius: 14, overflow: "hidden", marginBottom: 20,
      boxShadow: "0 4px 16px rgba(0,0,0,0.03)", transition: "all 0.2s ease"
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", background: `${currentInfo.color}10`, userSelect: "none"
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: currentInfo.color,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF"
          }}>
            <RoleIcon size={16} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>💡 Client Quick Guide:</span>
              <span style={{ color: currentInfo.color }}>{currentInfo.title}</span>
            </div>
            {!expanded && (
              <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 1 }}>
                {currentInfo.summary}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12,
            background: "var(--surface)", color: currentInfo.color, border: `1px solid ${currentInfo.color}40`
          }}>
            {currentInfo.role}
          </span>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "14px 18px", borderTop: `1px solid ${currentInfo.color}20`, background: "var(--surface)" }}>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 10px 0", lineHeight: 1.5 }}>
            {currentInfo.summary}
          </p>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted2)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Recommended Client Test Steps:
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12.5, color: "var(--ink)", display: "flex", flexDirection: "column", gap: 4 }}>
            {currentInfo.tips.map((tip, idx) => (
              <li key={idx} style={{ lineHeight: 1.4 }}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
