import React, { useState } from "react";
import { Shield, Clock, Search, Filter, Lock, Eye, CheckCircle2 } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ROLES } from "../constants/recruitmentData";

export function AuditLogsView() {
  const { state, dispatch } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const logs = state.auditLogs || [];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || log.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--surface)", padding: 20, borderRadius: 14,
        border: "1px solid var(--border)", boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ padding: 6, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)" }}>
              <Shield size={20} />
            </div>
            <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              System Security & Audit Logs
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted2)", margin: 0 }}>
            Master Admin audit trail tracking user authentication, role updates, and private resume file accesses.
          </p>
        </div>

        <div style={{
          fontSize: 12, padding: "6px 12px", borderRadius: 8, background: "var(--accent-soft)",
          color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
        }}>
          <Lock size={14} /> Compliance Logging Active
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: "flex", gap: 12, background: "var(--surface)", padding: 14,
        borderRadius: 12, border: "1px solid var(--border)", alignItems: "center"
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 10, color: "var(--muted2)" }} />
          <input
            type="text"
            placeholder="Search audit logs by user, action, or target candidate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px 8px 36px", borderRadius: 8,
              border: "1px solid var(--border)", outline: "none", fontSize: 13,
              background: "var(--paper)"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={15} color="var(--muted2)" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--surface)", fontSize: 13, fontWeight: 500, outline: "none"
            }}>
            <option value="all">All Roles ({logs.length})</option>
            <option value="admin">Master Admin Logs</option>
            <option value="recruiter">Recruiter Logs</option>
            <option value="hr">HR Manager Logs</option>
          </select>
        </div>
      </div>

      {/* AUDIT LOGS TABLE */}
      <div style={{
        background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--border)", color: "var(--muted2)", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>Log ID</th>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>User Name & Role</th>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>Action Performed</th>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>Target Resource</th>
              <th style={{ padding: "12px 18px", fontWeight: 600, textAlign: "right" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--muted2)" }}>
                  No audit log entries matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const roleObj = ROLES[log.userRole] || ROLES.candidate;
                const RoleIcon = roleObj.icon;

                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 18px" }}>
                      <span className="font-mono" style={{ fontSize: 11, color: "var(--muted2)", fontWeight: 600 }}>
                        {log.id}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 600, color: "var(--ink)" }}>{log.userName}</div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10.5,
                        color: roleObj.color, fontWeight: 600
                      }}>
                        <RoleIcon size={10} /> {roleObj.label}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px" }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
                        background: log.action.includes("Resume") ? "var(--accent-soft)" : "var(--primary-soft)",
                        color: log.action.includes("Resume") ? "var(--accent)" : "var(--primary)"
                      }}>
                        {log.action}
                      </span>
                    </td>

                    <td style={{ padding: "14px 18px", color: "var(--ink-soft)" }}>
                      {log.target}
                    </td>

                    <td className="font-mono" style={{ padding: "14px 18px", textAlign: "right", color: "var(--muted2)", fontSize: 12 }}>
                      {log.timestamp}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
