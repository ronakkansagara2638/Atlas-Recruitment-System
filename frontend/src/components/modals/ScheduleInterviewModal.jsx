import React, { useState } from "react";
import { X, Calendar, Clock, User, Video, Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export function ScheduleInterviewModal({ candidate, jobId, onClose }) {
  const { dispatch } = useStore();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("14:00");
  const [interviewer, setInterviewer] = useState("David Chen (Hiring Manager)");
  const [notes, setNotes] = useState("Technical & System Architecture Round");

  const handleSchedule = (e) => {
    e.preventDefault();
    const slug = candidate.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 8);
    const meetUrl = `https://meet.google.com/atl-${slug}`;

    dispatch({
      type: "SCHEDULE_INTERVIEW",
      jobId,
      candidateId: candidate.id,
      interview: {
        date,
        time,
        interviewer,
        notes,
        meetUrl,
        status: "Scheduled",
      },
    });

    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,17,23,.65)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 110, padding: 20
    }}>
      <div className="atlas-fade-in" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, width: "100%", maxWidth: 500, padding: 24,
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Calendar size={18} />
              </div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                Schedule Candidate Interview
              </h2>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted2)", margin: "4px 0 0 0" }}>
              Scheduling for <strong>{candidate.name}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSchedule} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                Interview Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: "1px solid var(--border)", fontSize: 13, outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: "1px solid var(--border)", fontSize: 13, outline: "none", background: "var(--surface)"
                }}>
                <option value="10:00">10:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:30">03:30 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Interviewer
            </label>
            <select
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: "1px solid var(--border)", fontSize: 13, outline: "none", background: "var(--surface)"
              }}>
              <option value="Sarah Jenkins (Recruiter)">Sarah Jenkins (Recruiter)</option>
              <option value="David Chen (Hiring Manager)">David Chen (Hiring Manager)</option>
              <option value="Master Admin (Panel Lead)">Master Admin (Panel Lead)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Round Agenda / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Technical & Architecture Round"
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: "1px solid var(--border)", fontSize: 13, outline: "none"
              }}
            />
          </div>

          <div style={{
            fontSize: 11.5, color: "var(--info)", background: "var(--info-soft)",
            padding: "8px 12px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6
          }}>
            <Video size={14} /> Auto-generated Video Link: <strong>Google Meet</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
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
              <Check size={16} /> Confirm & Schedule
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
