import React from "react";
import { Briefcase, FileSearch, Users, Calendar, Award } from "lucide-react";

export function RecruitmentStepper() {
  const steps = [
    { number: "1", title: "Job Posting", desc: "Recruiter creates role & requirements", icon: Briefcase, color: "#3B82F6" },
    { number: "2", title: "AI ATS Screening", desc: "Candidate applies & algorithm calculates score", icon: FileSearch, color: "#10B981" },
    { number: "3", title: "HR Review", desc: "HR manager evaluates top candidates", icon: Users, color: "#8B5CF6" },
    { number: "4", title: "Video Interview", desc: "Live video assessment & evaluation", icon: Calendar, color: "#F59E0B" },
    { number: "5", title: "Offer & Hired", desc: "Final offer extended to top talent", icon: Award, color: "#059669" },
  ];

  return (
    <div style={{
      background: "var(--surface)", padding: "16px 20px", borderRadius: 14,
      border: "1px solid var(--border)", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--muted2)", letterSpacing: "0.05em", marginBottom: 12 }}>
        🔄 End-to-End Recruitment Lifecycle at a Glance
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, position: "relative" }}>
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} style={{
              display: "flex", flexDirection: "column", gap: 6, padding: "10px 12px",
              borderRadius: 10, background: "var(--paper)", border: "1px solid var(--border)",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", background: s.color,
                  color: "#FFF", fontSize: 11, fontWeight: 800, display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  {s.number}
                </div>
                <Icon size={16} color={s.color} />
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{s.title}</div>
              <div style={{ fontSize: 11, color: "var(--muted2)", lineHeight: 1.3 }}>{s.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
