import React, { useState } from "react";
import { Plus, Briefcase, Users, Clock, CheckCircle2, Sparkles, UploadCloud, Calendar, Video, ArrowRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { PipelineFunnel } from "../components/common/PipelineFunnel";
import { KpiCard } from "../components/cards/KpiCard";
import { ResumeUploadModal } from "../components/modals/ResumeUploadModal";
import { CandidateDetailModal } from "../components/modals/CandidateDetailModal";
import { useStore } from "../context/StoreContext";
import { can } from "../constants/recruitmentData";

import { RecruitmentStepper } from "../components/common/RecruitmentStepper";

export function DashboardView({ setView, openCreate }) {
  const { state, dispatch } = useStore();
  const { jobs, role, user } = state;
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const allCandidates = jobs.flatMap(j => j.candidates.map(c => ({ ...c, jobTitle: j.title, jobId: j.id })));
  const openJobs = jobs.filter(j => j.status === "Open").length;
  const hired = allCandidates.filter(c => c.stage === "Hired").length;
  const inInterview = allCandidates.filter(c => c.stage === "Interview" || c.stage === "Offer").length;

  // Top Ranked AI Candidates across all jobs
  const topRanked = [...allCandidates].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);

  // Scheduled Interviews
  const scheduledInterviews = allCandidates.filter(c => c.interview && c.interview.date);

  const chartData = jobs.map(j => ({ name: j.title.split(" ").slice(0, 2).join(" "), candidates: j.candidates.length }));

  const roleLabel = role === "admin" ? "Master Admin Dashboard" : role === "hiring_manager" ? "Hiring Manager Portal" : "Recruiter Dashboard";

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Header Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "var(--primary-soft)", color: "var(--primary)" }}>
              {roleLabel}
            </span>
          </div>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Recruitment & AI Intelligence</div>
          <div style={{ fontSize: 13, color: "var(--muted2)", marginTop: 3 }}>
            Welcome back, {user?.name || "User"}. Managing {openJobs} active job opening{openJobs !== 1 ? "s" : ""} and {allCandidates.length} pipeline candidates.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setShowUpload(true)}
            style={{
              padding: "9px 14px", borderRadius: 9, border: "1px solid var(--border-strong)",
              background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, color: "var(--ink)"
            }}>
            <UploadCloud size={16} color="var(--primary)" /> AI Resume Upload
          </button>
          {can(role, "create_job") && <Button icon={Plus} onClick={openCreate}>Post a Role</Button>}
        </div>
      </div>

      {/* RECRUITMENT LIFECYCLE STEPPER */}
      <RecruitmentStepper />

      {/* KPI Metrics */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <KpiCard label="Open roles" value={openJobs} sub={`${jobs.length - openJobs} closed`} icon={Briefcase} tone={{ bg: "var(--primary-soft)", fg: "var(--primary)" }} />
        <KpiCard label="Active candidates" value={allCandidates.length} sub="in pipeline" icon={Users} tone={{ bg: "var(--info-soft)", fg: "var(--info)" }} />
        <KpiCard label="In interview / offer" value={inInterview} sub="needs attention" icon={Clock} tone={{ bg: "var(--accent-soft)", fg: "var(--accent)" }} />
        <KpiCard label="Hired" value={hired} sub="this cycle" icon={CheckCircle2} tone={{ bg: "var(--success-soft)", fg: "var(--success)" }} />
      </div>

      {/* TOP AI RANKED CANDIDATES TABLE */}
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={16} color="var(--primary)" /> Top Ranked Candidates (AI Match Score)
            </div>
            <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Highest scoring applicants automatically prioritized across all roles.</div>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--border)", color: "var(--muted2)", fontSize: 11, textTransform: "uppercase" }}>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Rank & Candidate</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Applied Role</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>Stage</th>
                <th style={{ padding: "10px 14px", fontWeight: 600 }}>AI Match Breakdown</th>
                <th style={{ padding: "10px 14px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {topRanked.map((c, idx) => {
                const scoreColor = c.score >= 85 ? "#10B981" : c.score >= 70 ? "#3B82F6" : "#F59E0B";
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="font-mono" style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                          background: idx === 0 ? "var(--primary)" : "var(--paper)",
                          color: idx === 0 ? "#FFF" : "var(--muted2)"
                        }}>
                          #{idx + 1}
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--muted2)" }}>{c.jobTitle}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
                        background: "var(--primary-soft)", color: "var(--primary)"
                      }}>
                        {c.stage}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", minWidth: 160 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--paper)", overflow: "hidden" }}>
                          <div style={{ width: `${c.score}%`, height: "100%", background: scoreColor, borderRadius: 3 }} />
                        </div>
                        <span className="font-mono" style={{ fontWeight: 700, fontSize: 12, color: scoreColor }}>
                          {c.score}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        style={{
                          padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)",
                          background: "var(--surface)", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          color: "var(--primary)"
                        }}>
                        View Brief
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SCHEDULED INTERVIEWS & PIPELINE CHARTS */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {/* Scheduled Interviews Panel */}
        <Card style={{ padding: 20, flex: "1 1 340px" }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={16} color="var(--primary)" /> Upcoming Scheduled Interviews ({scheduledInterviews.length})
          </div>
          <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 12 }}>Upcoming candidate video assessments.</div>

          {scheduledInterviews.length === 0 ? (
            <div style={{ fontSize: 12.5, color: "var(--muted2)", padding: 20, textAlign: "center" }}>
              No interviews scheduled yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scheduledInterviews.map((c) => (
                <div key={c.id} style={{ background: "var(--paper)", padding: 12, borderRadius: 9, border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted2)" }}>{c.jobTitle}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--primary)", background: "var(--primary-soft)", padding: "2px 6px", borderRadius: 4 }}>
                      {c.interview.time}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 11.5, color: "var(--muted2)" }}>
                    <span>Date: {c.interview.date}</span>
                    {c.interview.meetUrl && (
                      <a href={c.interview.meetUrl} target="_blank" rel="noreferrer" style={{ color: "var(--info)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                        <Video size={12} /> Join Call
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Volume Chart */}
        <Card style={{ padding: 20, flex: "1 1 340px" }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>Candidates per role</div>
          <div style={{ fontSize: 12, color: "var(--muted2)", marginBottom: 12 }}>Where volume is concentrated right now.</div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted2)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} cursor={{ fill: "var(--paper)" }} />
                <Bar dataKey="candidates" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill="var(--primary)" fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {showUpload && (
        <ResumeUploadModal
          onClose={() => setShowUpload(false)}
        />
      )}

      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          jobId={selectedCandidate.jobId}
          onClose={() => setSelectedCandidate(null)}
          onScheduleInterview={() => setSelectedCandidate(null)}
          onLaunchAssessment={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
