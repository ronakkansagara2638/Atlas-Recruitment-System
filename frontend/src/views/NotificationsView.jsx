import React from "react";
import { Bell, CheckCircle2, Calendar, FileText, Sparkles, User, Briefcase } from "lucide-react";
import { useStore } from "../context/StoreContext";

export function NotificationsView() {
  const { state } = useStore();
  const { role, user } = state;

  const getNotifications = () => {
    if (role === "candidate") {
      return [
        { id: 1, title: "Application Received", desc: "Your application for Senior Frontend Engineer has been received and parsed by AI.", time: "2 hours ago", type: "success" },
        { id: 2, title: "Interview Scheduled", desc: "Technical & System Architecture Round scheduled for tomorrow at 02:00 PM.", time: "1 day ago", type: "info" },
      ];
    } else if (role === "hr") {
      return [
        { id: 1, title: "Candidate Shortlisted", desc: "Priya Nair has been shortlisted by Recruiter Sarah Jenkins and forwarded to HR.", time: "30 mins ago", type: "primary" },
        { id: 2, title: "Interview Reminder", desc: "Interview with Ishita Verma scheduled for tomorrow at 04:00 PM.", time: "3 hours ago", type: "info" },
      ];
    } else if (role === "recruiter") {
      return [
        { id: 1, title: "New Resume Application", desc: "Vikram Malhotra applied for Senior Frontend Engineer (Match Score: 94%).", time: "10 mins ago", type: "success" },
        { id: 2, title: "Job Deadline Alert", desc: "Application deadline for Product Designer is approaching in 10 days.", time: "5 hours ago", type: "warning" },
      ];
    } else {
      return [
        { id: 1, title: "System Audit Log Created", desc: "HR Manager David Chen accessed private candidate resume for Sara Thomas.", time: "1 hour ago", type: "warning" },
        { id: 2, title: "New User Registered", desc: "Candidate Alex Rivera registered a new candidate account.", time: "2 hours ago", type: "info" },
      ];
    }
  };

  const notifications = getNotifications();

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--surface)", padding: 20, borderRadius: 14,
        border: "1px solid var(--border)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
              <Bell size={20} />
            </div>
            <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              System Notifications
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted2)", margin: 0 }}>
            Real-time updates tailored for your <strong>{role.toUpperCase()}</strong> workspace.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            background: "var(--surface)", padding: 18, borderRadius: 12,
            border: "1px solid var(--border)", display: "flex", gap: 14, alignItems: "flex-start"
          }}>
            <div style={{
              padding: 10, borderRadius: 10, background: "var(--primary-soft)", color: "var(--primary)",
              flexShrink: 0
            }}>
              <Sparkles size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{n.title}</div>
                <span className="font-mono" style={{ fontSize: 11, color: "var(--muted2)" }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                {n.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
