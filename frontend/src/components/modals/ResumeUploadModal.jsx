import React, { useState } from "react";
import { X, UploadCloud, Sparkles, Check, AlertCircle, FileText, CheckCircle2, Award } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { makeCandidate, calculateMatch } from "../../constants/recruitmentData";

const SAMPLE_RESUMES = [
  {
    name: "Vikram Malhotra",
    email: "vikram.m@techlead.io",
    experienceYears: 7,
    education: "B.Tech Computer Engineering - IIIT Hyderabad",
    skills: ["React", "TypeScript", "Node.js", "UI performance and accessibility", "System Architecture", "End-to-end domain ownership"],
    resumeText: "Senior Software Engineer with 7 years experience building high throughput web platforms with React and TypeScript.",
  },
  {
    name: "Anjali Deshmukh",
    email: "anjali.d@uxdesign.com",
    experienceYears: 5,
    education: "B.Des Product Design - NID Ahmedabad",
    skills: ["Figma", "Design Systems", "User Research", "B2B SaaS", "Prototyping", "Shipped B2B software"],
    resumeText: "Product Designer with 5 years experience creating design systems and B2B SaaS interfaces in Figma.",
  },
  {
    name: "Rohan Kapoor",
    email: "rohan.kapoor@mail.com",
    experienceYears: 3,
    education: "B.E. Information Technology - Pune Univ",
    skills: ["JavaScript", "React", "HTML/CSS", "Git", "REST APIs"],
    resumeText: "Frontend developer with 3 years experience building responsive web apps with React and JavaScript.",
  },
];

export function ResumeUploadModal({ defaultJobId, onClose }) {
  const { state, dispatch } = useStore();
  const [selectedJobId, setSelectedJobId] = useState(defaultJobId || state.jobs[0]?.id || "");
  const [resumeText, setResumeText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [parsing, setParsing] = useState(false);

  const selectedJob = state.jobs.find(j => j.id === selectedJobId) || state.jobs[0];

  const handleSelectSample = (sample) => {
    setCandidateName(sample.name);
    setCandidateEmail(sample.email);
    setResumeText(sample.resumeText);

    runAiParsing(sample.name, sample.email, sample.skills, sample.experienceYears, sample.education, sample.resumeText);
  };

  const runAiParsing = (name, email, explicitSkills, expYears, edu, text) => {
    setParsing(true);
    setTimeout(() => {
      const skills = explicitSkills || [
        "React", "JavaScript", "TypeScript", "CSS", "Problem Solving"
      ];
      
      const match = calculateMatch(skills, selectedJob?.requirements || []);

      setParsedData({
        name: name || "Parsed Candidate",
        email: email || "candidate@parsed.io",
        experienceYears: expYears || 4,
        education: edu || "B.S. Computer Science",
        skills,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        score: match.score,
        summary: `AI parsed profile for ${name || "Candidate"}. Demonstrates strong relevance to ${selectedJob?.title || "role"} with ${match.score}% skill alignment.`,
      });
      setParsing(false);
    }, 400);
  };

  const handleCustomParse = () => {
    if (!candidateName.trim()) {
      alert("Please enter candidate name.");
      return;
    }
    runAiParsing(candidateName, candidateEmail || `${candidateName.toLowerCase().replace(/\s+/g, ".")}@mail.com`, null, 4, "B.S. Computer Science", resumeText);
  };

  const handleImportCandidate = () => {
    if (!parsedData) return;

    const newCandidate = makeCandidate(
      parsedData.name,
      parsedData.email,
      "Applied",
      0,
      parsedData.score,
      {
        skills: parsedData.skills,
        matchedSkills: parsedData.matchedSkills,
        missingSkills: parsedData.missingSkills,
        summary: parsedData.summary,
        experienceYears: parsedData.experienceYears,
        education: parsedData.education,
        reqs: selectedJob?.requirements || [],
      }
    );

    dispatch({
      type: "ADD_CANDIDATE",
      jobId: selectedJobId,
      candidate: newCandidate,
    });

    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,17,23,.65)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: 20
    }}>
      <div className="atlas-fade-in" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, width: "100%", maxWidth: 620, maxHeight: "90vh",
        overflowY: "auto", padding: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
      }}>
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
                <Sparkles size={18} />
              </div>
              <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                AI Resume Upload & Match Score
              </h2>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted2)", margin: "4px 0 0 0" }}>
              Upload or select a resume to automatically extract skills and compute job match alignment.
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Target Job Selection */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
            Target Job Opening
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setParsedData(null);
            }}
            style={{
              width: "100%", padding: "9px 12px", borderRadius: 9,
              border: "1px solid var(--border-strong)", background: "var(--surface)",
              fontSize: 13, fontWeight: 600, color: "var(--ink)", outline: "none"
            }}>
            {state.jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.department}) — {j.candidates.length} candidates
              </option>
            ))}
          </select>
        </div>

        {/* Preset Sample Selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted2)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>
            1-CLICK PRE-PARSED RESUME SAMPLES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
            {SAMPLE_RESUMES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sample)}
                style={{
                  padding: "10px 12px", borderRadius: 9, border: "1px solid var(--border)",
                  background: "var(--paper)", textAlign: "left", cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--ink)" }}>{sample.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted2)" }}>{sample.experienceYears}y exp • {sample.skills[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Resume Form */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--muted2)", marginBottom: 4 }}>
                Candidate Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: "1px solid var(--border)", fontSize: 12.5, outline: "none"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--muted2)", marginBottom: 4 }}>
                Email
              </label>
              <input
                type="email"
                placeholder="ramesh@mail.com"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  border: "1px solid var(--border)", fontSize: 12.5, outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: "var(--muted2)", marginBottom: 4 }}>
              Paste Resume Content / Text Snippet
            </label>
            <textarea
              rows={3}
              placeholder="Paste raw resume text here to analyze skills automatically..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: "1px solid var(--border)", fontSize: 12, outline: "none",
                fontFamily: "inherit", resize: "none"
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleCustomParse}
            disabled={parsing}
            style={{
              marginTop: 10, padding: "8px 16px", borderRadius: 8, border: "none",
              background: "var(--primary-soft)", color: "var(--primary)", fontWeight: 600,
              fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}>
            <Sparkles size={14} /> Parse & Compute AI Match Score
          </button>
        </div>

        {/* AI PARSED RESULTS CARD */}
        {parsing && (
          <div style={{ padding: 20, textAlign: "center", color: "var(--muted2)", fontSize: 13 }}>
            <span className="atlas-spin" style={{ marginRight: 8 }}><Sparkles size={16} /></span>
            Analyzing resume & computing AI match score...
          </div>
        )}

        {parsedData && !parsing && (
          <div style={{
            background: "var(--paper)", border: "1px solid var(--border-strong)",
            borderRadius: 12, padding: 18, marginBottom: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{parsedData.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted2)" }}>{parsedData.education} • {parsedData.experienceYears} Years Exp</div>
              </div>

              <div style={{
                textAlign: "right", background: "var(--surface)", padding: "6px 14px",
                borderRadius: 10, border: "1px solid var(--border)"
              }}>
                <div style={{ fontSize: 10, color: "var(--muted2)", textTransform: "uppercase", fontWeight: 700 }}>AI MATCH SCORE</div>
                <div className="font-mono" style={{ fontSize: 20, fontWeight: 700, color: parsedData.score >= 80 ? "var(--success)" : "var(--primary)" }}>
                  {parsedData.score}%
                </div>
              </div>
            </div>

            {/* Matched Skills */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--success)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={13} /> MATCHED REQUIREMENTS ({parsedData.matchedSkills.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {parsedData.matchedSkills.map((sk, i) => (
                  <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--success-soft)", color: "var(--success)", fontWeight: 600 }}>
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            {parsedData.missingSkills.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--accent)", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={13} /> GAP AREAS ({parsedData.missingSkills.length})
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {parsedData.missingSkills.map((sk, i) => (
                    <span key={i} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--accent-soft)", color: "var(--accent)", fontWeight: 500 }}>
                      ! {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Executive Brief */}
            <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5, background: "var(--surface)", padding: 10, borderRadius: 8 }}>
              <strong>AI Recruiter Brief:</strong> {parsedData.summary}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: "9px 16px", borderRadius: 9, border: "1px solid var(--border)",
              background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>
            Cancel
          </button>
          <button
            onClick={handleImportCandidate}
            disabled={!parsedData}
            style={{
              padding: "9px 18px", borderRadius: 9, border: "none",
              background: parsedData ? "var(--primary)" : "var(--border-strong)",
              color: "#FFF", fontSize: 13, fontWeight: 600, cursor: parsedData ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 6
            }}>
            <Check size={16} /> Import Candidate to Pipeline
          </button>
        </div>

      </div>
    </div>
  );
}
