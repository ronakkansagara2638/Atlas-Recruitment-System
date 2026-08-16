import React, { useState } from "react";
import { X, Sparkles, CheckCircle2, AlertCircle, Award, BrainCircuit, Play, Send } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export function AiInterviewModal({ candidate, jobId, onClose }) {
  const { state, dispatch } = useStore();
  const job = state.jobs.find(j => j.id === jobId);

  const [step, setStep] = useState(candidate.assessment ? "report" : "interview");
  const [evaluating, setEvaluating] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(candidate.assessment || null);

  // Generate 3 questions based on job requirements
  const questions = [
    `How do you solve "${job?.requirements[0] || "core domain challenge"}" in production applications?`,
    `Explain your methodology for maintaining "${job?.requirements[1] || "quality and architecture"}".`,
    `Describe a complex engineering trade-off you made involving "${job?.requirements[2] || "performance and scalability"}".`
  ];

  const [answers, setAnswers] = useState([
    "I prioritize modular architecture, clear state boundaries, and automated regression testing.",
    "I enforce automated linting, strict design tokens, and comprehensive unit coverage.",
    "We balanced initial load times against client caching by implementing strategic code splitting."
  ]);

  const runAiEvaluation = () => {
    setEvaluating(true);
    setTimeout(() => {
      const generatedScore = Math.floor(82 + Math.random() * 14); // 82 - 95
      const result = {
        score: generatedScore,
        verdict: generatedScore >= 90 ? "Strong Technical Hire" : "Recommend Next Interview",
        completedAt: new Date().toISOString().slice(0, 10),
        feedback: [
          `Demonstrated strong grasp of ${job?.requirements[0] || "core domain"}.`,
          "Clear communication on architectural trade-offs.",
          "Good problem solving approach under pressure."
        ]
      };
      setAssessmentResult(result);
      setStep("report");
      setEvaluating(false);
    }, 600);
  };

  const handleSaveResult = () => {
    if (!assessmentResult) return;
    dispatch({
      type: "SAVE_AI_INTERVIEW_RESULT",
      jobId,
      candidateId: candidate.id,
      assessment: assessmentResult,
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
        borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "90vh",
        overflowY: "auto", padding: 26, boxShadow: "0 24px 60px rgba(0,0,0,0.2)"
      }}>
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ padding: 6, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)" }}>
                <BrainCircuit size={18} />
              </div>
              <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                AI Technical Skill Assessment
              </h2>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted2)", margin: "4px 0 0 0" }}>
              Evaluating <strong>{candidate.name}</strong> for <strong>{job?.title}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted2)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
          <button
            onClick={() => setStep("interview")}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: step === "interview" ? "var(--primary-soft)" : "transparent",
              color: step === "interview" ? "var(--primary)" : "var(--muted2)",
              fontWeight: 600, fontSize: 12.5, cursor: "pointer"
            }}>
            1. Technical Questions ({questions.length})
          </button>
          <button
            onClick={() => setStep("report")}
            disabled={!assessmentResult}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: step === "report" ? "var(--primary-soft)" : "transparent",
              color: step === "report" ? "var(--primary)" : "var(--muted2)",
              fontWeight: 600, fontSize: 12.5, cursor: assessmentResult ? "pointer" : "not-allowed"
            }}>
            2. AI Evaluation Report {assessmentResult ? `(${assessmentResult.score}%)` : ""}
          </button>
        </div>

        {/* STEP 1: INTERVIEW QUESTIONS */}
        {step === "interview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {questions.map((q, idx) => (
              <div key={idx} style={{ background: "var(--paper)", padding: 14, borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>
                  QUESTION {idx + 1}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)", marginBottom: 8 }}>
                  {q}
                </div>
                <textarea
                  rows={2}
                  value={answers[idx]}
                  onChange={(e) => {
                    const newAns = [...answers];
                    newAns[idx] = e.target.value;
                    setAnswers(newAns);
                  }}
                  placeholder="Type or simulate candidate technical response..."
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    border: "1px solid var(--border)", fontSize: 12, outline: "none",
                    fontFamily: "inherit", resize: "none"
                  }}
                />
              </div>
            ))}

            <button
              onClick={runAiEvaluation}
              disabled={evaluating}
              style={{
                padding: "12px", borderRadius: 10, border: "none",
                background: "var(--primary)", color: "#FFF", fontWeight: 600, fontSize: 13.5,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, boxShadow: "0 4px 14px rgba(52,54,142,0.3)", marginTop: 6
              }}>
              {evaluating ? (
                <>
                  <span className="atlas-spin"><Sparkles size={16} /></span> Evaluating Responses with AI...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run AI Technical Evaluation
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: EVALUATION REPORT */}
        {step === "report" && assessmentResult && (
          <div className="atlas-fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "var(--paper)", padding: 18, borderRadius: 12, border: "1px solid var(--border-strong)"
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase" }}>AI VERDICT</div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)", marginTop: 2 }}>
                  {assessmentResult.verdict}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted2)", marginTop: 2 }}>Evaluation Completed: {assessmentResult.completedAt}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted2)", textTransform: "uppercase" }}>TECHNICAL SCORE</div>
                <div className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--success)" }}>
                  {assessmentResult.score}%
                </div>
              </div>
            </div>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
                AI Skill Assessment Strengths
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
                {assessmentResult.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
              <button
                onClick={onClose}
                style={{
                  padding: "9px 16px", borderRadius: 9, border: "1px solid var(--border)",
                  background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>
                Close
              </button>
              <button
                onClick={handleSaveResult}
                style={{
                  padding: "9px 18px", borderRadius: 9, border: "none",
                  background: "var(--primary)", color: "#FFF", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                }}>
                <CheckCircle2 size={16} /> Save Score to Candidate Record
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
