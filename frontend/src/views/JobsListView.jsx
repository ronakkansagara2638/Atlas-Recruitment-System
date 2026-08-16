import React, { useState } from "react";
import { Plus, Search, Building2, MapPin, Calendar, Eye } from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Badge } from "../components/common/Badge";
import { PipelineFunnel } from "../components/common/PipelineFunnel";
import { EmptyState } from "../components/common/EmptyState";
import { useStore } from "../context/StoreContext";
import { can } from "../constants/recruitmentData";

const inputStyle = {
  border: "1px solid var(--border-strong)", borderRadius: 8, padding: "9px 11px",
  fontSize: 13.5, fontFamily: "Inter, sans-serif", background: "var(--surface)", color: "var(--ink)",
  outline: "none", width: "100%", boxSizing: "border-box",
};

export function JobsListView({ setView, openCreate }) {
  const { state, dispatch } = useStore();
  const { jobs, role } = state;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(query.toLowerCase()) &&
    (statusFilter === "All" || j.status === statusFilter)
  );

  const toggleJobStatus = (job) => {
    const newStatus = job.status === "Published" ? "Closed" : "Published";
    dispatch({ type: "UPDATE_JOB_STATUS", jobId: job.id, newStatus });
  };

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>Job postings</div>
        {can(role, "create_job") && <Button icon={Plus} onClick={openCreate}>Post a role</Button>}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={14} color="var(--muted2)" style={{ position: "absolute", left: 11, top: 11 }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search roles…"
            style={{ ...inputStyle, paddingLeft: 32 }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Published", "Draft", "Paused", "Closed"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: "7px 13px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${statusFilter === s ? "var(--primary)" : "var(--border-strong)"}`,
              background: statusFilter === s ? "var(--primary-soft)" : "var(--surface)",
              color: statusFilter === s ? "var(--primary)" : "var(--ink-soft)",
            }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(j => (
          <Card key={j.id} style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 260px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontWeight: 700, fontSize: 15.5 }}>{j.title}</span>
                  <Badge tone={j.status === "Published" ? "success" : "default"}>{j.status}</Badge>
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 12, color: "var(--muted2)", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Building2 size={12} />{j.department}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{j.location}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{j.createdAt}</span>
                </div>
                <div style={{ marginTop: 12, maxWidth: 420 }}>
                  <PipelineFunnel candidates={j.candidates} compact />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", justifyContent: "space-between" }}>
                <Button size="sm" variant="outline" icon={Eye}
                  onClick={() => { dispatch({ type: "SELECT_JOB", jobId: j.id }); setView("job_detail"); }}>
                  View pipeline
                </Button>
                {can(role, "edit_job") && (
                  <Button size="sm" variant="ghost" onClick={() => toggleJobStatus(j)}>
                    {j.status === "Published" ? "Close role" : "Reopen role"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <EmptyState text="No roles match that search." />}
      </div>
    </div>
  );
}
