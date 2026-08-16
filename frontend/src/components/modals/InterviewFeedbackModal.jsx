import React, { useState } from "react";
import { X, Star, CheckCircle2, XCircle, Award, MessageSquare } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export function InterviewFeedbackModal({ candidate, jobId, onClose }) {
  const { dispatch } = useStore();
  const [rating, setRating] = useState(4);
  const [notes, setNotes] = useState("Demonstrated strong technical depth, communication skills, and team leadership potential.");
  const [verdict, setVerdict] = useState("Selected");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_INTERVIEW_FEEDBACK",
      jobId,
      candidateId: candidate.id,
      feedback: {
        rating,
        notes,
        verdict,
        date: new Date().toISOString().slice(0, 10),
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
        borderRadius: 16, width: "100%", maxWidth: 520, padding: 24,
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
                <MessageSquare size={18} />
              </div>
              <h2 className="font-display" style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>
                HR Interview Feedback & Decision
              </h2>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted2)", margin: "4px 0 0 0" }}>
              Evaluation for <strong>{candidate.name}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Star Rating */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
              Candidate Rating
            </label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 2
                  }}>
                  <Star size={22} fill={star <= rating ? "#D6A800" : "none"} color={star <= rating ? "#D6A800" : "var(--border-strong)"} />
                </button>
              ))}
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginLeft: 6, alignSelf: "center" }}>
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Feedback Notes */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Interview Notes & Observations
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record candidate strengths, technical depth, and interview comments..."
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: "1px solid var(--border)", fontSize: 12.5, outline: "none",
                fontFamily: "inherit", resize: "none"
              }}
            />
          </div>

          {/* Verdict Selector */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Final Hiring Verdict
            </label>
            <select
              value={verdict}
              onChange={(e) => setVerdict(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: "1px solid var(--border-strong)", fontSize: 13, fontWeight: 600,
                color: "var(--primary)", background: "var(--surface)", outline: "none"
              }}>
              <option value="Selected">Selected (Recommend Offer)</option>
              <option value="Hired">Hired (Onboarding Finalized)</option>
              <option value="Rejected">Rejected (Do Not Pursue)</option>
            </select>
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
              <CheckCircle2 size={16} /> Save Feedback & Decision
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
