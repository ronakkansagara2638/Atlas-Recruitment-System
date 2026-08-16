import React, { useState } from "react";
import { Users, Shield, Briefcase, User, Search, Trash2, UserPlus, Filter, Check, AlertCircle } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { ROLES, MASTER_ADMIN } from "../constants/recruitmentData";

export function UsersManagementView() {
  const { state, dispatch } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Add User Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("recruiter");
  const [addError, setAddError] = useState("");

  const users = state.users || [];

  // Metrics
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;
  const recruiterCount = users.filter(u => u.role === "recruiter").length;
  const hrCount = users.filter(u => u.role === "hr").length;
  const candidateCount = users.filter(u => u.role === "candidate").length;

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId, newRole) => {
    dispatch({ type: "UPDATE_USER_ROLE", userId, newRole });
  };

  const handleDeleteUser = (userId, userEmail) => {
    if (userEmail.toLowerCase() === MASTER_ADMIN.email.toLowerCase()) {
      alert("Master Admin account cannot be deleted.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete account for ${userEmail}?`)) {
      dispatch({ type: "DELETE_USER", userId });
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    setAddError("");

    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setAddError("Please fill out all fields.");
      return;
    }

    const emailClean = newEmail.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === emailClean)) {
      setAddError("An account with this email address already exists.");
      return;
    }

    dispatch({
      type: "SIGNUP",
      userData: {
        name: newName.trim(),
        email: emailClean,
        password: newPassword,
        role: newRole,
      },
    });

    dispatch({
      type: "LOG_RESUME_ACCESS",
      candidateName: newName.trim(),
      jobId: "User Management",
      actionName: `Master Admin Created ${newRole === "hr" ? "HR Manager" : "Recruiter"} Account`,
    });

    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("recruiter");
  };

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
            <div style={{
              padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)"
            }}>
              <Shield size={20} />
            </div>
            <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              User & Role Management
            </h1>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted2)", margin: 0 }}>
            Master Admin control panel for adding recruiters, HR managers, and auditing platform roles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "9px 16px", borderRadius: 9, border: "none",
            background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 14px rgba(52,54,142,0.3)"
          }}>
          <UserPlus size={16} /> Add Recruiter / HR Staff
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--muted2)", fontWeight: 600, marginBottom: 6 }}>TOTAL USERS</div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{totalUsers}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Shield size={14} /> MASTER ADMIN
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{adminCount}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--info)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Briefcase size={14} /> RECRUITERS
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{recruiterCount}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "#7A57C4", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <Users size={14} /> HR MANAGERS
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{hrCount}</div>
        </div>

        <div style={{ background: "var(--surface)", padding: "16px 20px", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
            <User size={14} /> CANDIDATES
          </div>
          <div className="font-display" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)" }}>{candidateCount}</div>
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
            placeholder="Search users by name or email..."
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
            <option value="all">All Roles ({totalUsers})</option>
            <option value="admin">Master Admin ({adminCount})</option>
            <option value="recruiter">Recruiters ({recruiterCount})</option>
            <option value="hr">HR Managers ({hrCount})</option>
            <option value="candidate">Candidates ({candidateCount})</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)",
        overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--border)", color: "var(--muted2)", fontSize: 11, textTransform: "uppercase" }}>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>User Info</th>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>Email Address</th>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>System Role</th>
              <th style={{ padding: "12px 18px", fontWeight: 600 }}>Registered Date</th>
              <th style={{ padding: "12px 18px", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--muted2)" }}>
                  No users found matching filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isMaster = u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase();
                const roleObj = ROLES[u.role] || ROLES.candidate;

                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    {/* User Info */}
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%", background: isMaster ? "var(--accent)" : "var(--primary-soft)",
                          color: isMaster ? "#FFF" : "var(--primary)", fontWeight: 700, fontSize: 12,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {u.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--ink)" }}>{u.name}</div>
                          {isMaster && (
                            <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600 }}>Master Admin Account</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: "14px 18px", color: "var(--ink-soft)" }}>
                      {u.email}
                    </td>

                    {/* System Role */}
                    <td style={{ padding: "14px 18px" }}>
                      {isMaster ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
                          borderRadius: 6, fontSize: 12, fontWeight: 600, background: "var(--accent-soft)", color: "var(--accent)"
                        }}>
                          <Shield size={12} /> Master Admin
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{
                            padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border-strong)",
                            background: "var(--surface)", fontSize: 12, fontWeight: 600, color: "var(--primary)",
                            cursor: "pointer", outline: "none"
                          }}>
                          <option value="recruiter">Recruiter</option>
                          <option value="hr">HR Manager</option>
                          <option value="candidate">Candidate</option>
                        </select>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: "14px 18px", color: "var(--muted2)", fontSize: 12 }}>
                      {u.createdAt || "2026-07-01"}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      {!isMaster && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          title="Delete Account"
                          style={{
                            padding: 6, borderRadius: 6, border: "none", background: "var(--danger-soft)",
                            color: "var(--danger)", cursor: "pointer"
                          }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,17,23,.65)",
          backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 110, padding: 20
        }}>
          <div className="atlas-fade-in" style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, width: "100%", maxWidth: 480, padding: 24,
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
                  <UserPlus size={18} />
                </div>
                <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                  Create Recruiter or HR Staff Account
                </h2>
              </div>
            </div>

            <form onSubmit={handleAddUserSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {addError && (
                <div style={{
                  padding: "8px 12px", borderRadius: 8, background: "var(--danger-soft)",
                  color: "var(--danger)", fontSize: 12.5, display: "flex", alignItems: "center", gap: 6
                }}>
                  <AlertCircle size={15} /> {addError}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                  Staff Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Chen"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    border: "1px solid var(--border)", fontSize: 13, outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    border: "1px solid var(--border)", fontSize: 13, outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    border: "1px solid var(--border)", fontSize: 13, outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                  Assigned System Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    border: "1px solid var(--border-strong)", fontSize: 13, fontWeight: 600,
                    color: "var(--primary)", background: "var(--surface)", outline: "none"
                  }}>
                  <option value="recruiter">Recruiter (Talent Acquisition & Sourcing)</option>
                  <option value="hr">HR Manager (Interviews & Hiring Decisions)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 18px", borderRadius: 8, border: "none",
                    background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                  }}>
                  <Check size={16} /> Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
