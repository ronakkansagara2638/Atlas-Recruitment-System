import React, { useState } from "react";
import { X, UploadCloud, FileText, Send, Sparkles } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const fieldLabel = {
  display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--muted2)", marginBottom: 4,
};
const fieldInput = {
  width: "100%", padding: "9px 11px", borderRadius: 8, border: "1px solid var(--border-strong)",
  fontSize: 13, outline: "none", background: "var(--surface)", color: "var(--ink)", boxSizing: "border-box",
  fontFamily: "inherit",
};

export function ApplyJobModal({ job, onClose }) {
  const { state, dispatch } = useStore();
  const user = state.user;

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [education, setEducation] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const okTypes = [".pdf", ".doc", ".docx"];
    const isValid = okTypes.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      setError("Please upload a PDF or Word document.");
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    const skills = skillsText.trim()
      ? skillsText.split(",").map((s) => s.trim()).filter(Boolean)
      : job.requirements || ["React", "JavaScript", "HTML/CSS"];

    setTimeout(() => {
      dispatch({
        type: "APPLY_TO_JOB",
        jobId: job.id,
        applicantName: name.trim(),
        applicantEmail: email.trim(),
        education: education.trim() || "B.S. Computer Science",
        expYears: Number(experienceYears) || 4,
        skills,
        resumeFileName: resumeFile ? resumeFile.name : `${name.trim().replace(/\s+/g, "_")}_Resume.pdf`,
        summary: `${name.trim()} applied for ${job.title}.`,
      });
      setSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,17,23,.65)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <div className="atlas-fade-in" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh",
        overflowY: "auto", padding: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              Apply to {job.title}
            </h2>
            <p style={{ fontSize: 12, color: "var(--muted2)", margin: "4px 0 0 0" }}>
              {job.department} · {job.location}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
          {/* Name + Email — auto-filled from account, still editable */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={fieldLabel}>Full Name</label>
              <input style={fieldInput} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label style={fieldLabel}>Email</label>
              <input style={fieldInput} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
          </div>

          {/* Resume upload */}
          <div>
            <label style={fieldLabel}>Resume (PDF or Word)</label>
            <label
              htmlFor="resume-upload-input"
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                border: `1.5px dashed ${resumeFile ? "var(--primary)" : "var(--border-strong)"}`,
                borderRadius: 10, cursor: "pointer",
                background: resumeFile ? "var(--primary-soft)" : "var(--paper)",
              }}>
              {resumeFile ? <FileText size={18} color="var(--primary)" /> : <UploadCloud size={18} color="var(--muted2)" />}
              <div style={{ fontSize: 12.5, color: resumeFile ? "var(--primary)" : "var(--muted2)", fontWeight: resumeFile ? 600 : 500 }}>
                {resumeFile ? resumeFile.name : "Click to upload your resume"}
              </div>
            </label>
            <input id="resume-upload-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          {/* Education + Experience */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={fieldLabel}>Education</label>
              <input
                style={fieldInput}
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>
            <div>
              <label style={fieldLabel}>Experience (years)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                style={fieldInput}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label style={fieldLabel}>Key Skills (comma separated, optional)</label>
            <input
              style={fieldInput}
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, TypeScript, REST APIs"
            />
          </div>

          <div style={{ fontSize: 11.5, color: "var(--muted2)", display: "flex", alignItems: "center", gap: 5 }}>
            <Sparkles size={12} color="var(--primary)" /> Your ATS match score will be calculated automatically against this role's requirements.
          </div>

          {error && (
            <div style={{ fontSize: 12, color: "var(--danger)", background: "var(--danger-soft, rgba(190,61,61,0.08))", padding: "8px 10px", borderRadius: 8 }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 16px", borderRadius: 9, border: "1px solid var(--border)",
              background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "9px 18px", borderRadius: 9, border: "none",
              background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
              display: "flex", alignItems: "center", gap: 6,
            }}>
            <Send size={14} /> {submitting ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
