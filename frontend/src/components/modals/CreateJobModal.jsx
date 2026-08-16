import React, { useState } from "react";
import { X, CheckCircle2, Wand2, Loader2 } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { useStore } from "../../context/StoreContext";

export async function generateJobDescription({ title, department, level, skills }) {
  const prompt = `You are helping an HR team draft a job posting.
Role title: ${title}
Department: ${department}
Seniority: ${level}
Key skills/context: ${skills || "not specified"}

Return ONLY a JSON object, no markdown fences, no commentary, with this exact shape:
{
  "summary": "2-3 sentence role summary, plain and specific, no fluff",
  "responsibilities": ["4-6 short bullet strings"],
  "requirements": ["4-6 short bullet strings"]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) throw new Error("Generator request failed");
  const data = await response.json();
  const text = (data.content || []).map(b => b.text || "").join("\n").trim();
  const cleaned = text.replace(/^```json/i, "").replace(/```$/, "").trim();
  return JSON.parse(cleaned);
}

function Field({ label, children, style }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--ink-soft)", ...style }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  border: "1px solid var(--border-strong)", borderRadius: 8, padding: "9px 11px",
  fontSize: 13.5, fontFamily: "Inter, sans-serif", background: "var(--surface)", color: "var(--ink)",
  outline: "none", width: "100%", boxSizing: "border-box",
};

export function CreateJobModal({ onClose }) {
  const { dispatch } = useStore();
  const [form, setForm] = useState({
    title: "", department: "Engineering", level: "Mid",
    location: "", skills: "", description: "", requirements: "",
  });
  const [aiState, setAiState] = useState("idle");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canGenerate = form.title.trim().length > 1;

  async function handleGenerate() {
    setAiState("loading");
    try {
      const result = await generateJobDescription(form);
      set("description", result.summary + "\n\nResponsibilities:\n" + result.responsibilities.map(r => "• " + r).join("\n"));
      set("requirements", result.requirements.join("\n"));
      setAiState("idle");
    } catch (e) {
      setAiState("error");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    dispatch({
      type: "CREATE_JOB",
      job: {
        title: form.title.trim(),
        department: form.department,
        level: form.level,
        location: form.location.trim() || "Remote",
        description: form.description.trim() || "Description pending.",
        requirements: form.requirements.split("\n").map(s => s.trim()).filter(Boolean),
      },
    });
    onClose();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(20,22,31,.45)", zIndex: 60,
      display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "5vh 16px",
    }} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <Card className="atlas-fade-in atlas-scroll" style={{
        width: 560, maxHeight: "90vh", overflowY: "auto", padding: 26,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div className="font-display" style={{ fontSize: 19, fontWeight: 700 }}>Post a role</div>
            <div style={{ fontSize: 12.5, color: "var(--muted2)", marginTop: 2 }}>Draft it manually, or let AI write the first pass.</div>
          </div>
          <button onClick={onClose} className="atlas-focus" style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            <X size={19} color="var(--muted2)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Job title">
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Backend Engineer" style={inputStyle} />
          </Field>

          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Department" style={{ flex: 1 }}>
              <select value={form.department} onChange={e => set("department", e.target.value)} style={inputStyle}>
                {["Engineering", "Design", "HR", "Sales", "Marketing", "Operations"].map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Level" style={{ flex: 1 }}>
              <select value={form.level} onChange={e => set("level", e.target.value)} style={inputStyle}>
                {["Junior", "Mid", "Senior", "Lead"].map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Location">
            <input value={form.location} onChange={e => set("location", e.target.value)}
              placeholder="e.g. Ahmedabad (Hybrid)" style={inputStyle} />
          </Field>

          <Field label="Key skills / context for AI (optional)">
            <input value={form.skills} onChange={e => set("skills", e.target.value)}
              placeholder="e.g. React, GraphQL, 4+ yrs, fintech domain" style={inputStyle} />
          </Field>

          <Button type="button" variant="accent"
            disabled={!canGenerate || aiState === "loading"} onClick={handleGenerate}
            style={{ alignSelf: "flex-start" }}>
            <span className={aiState === "loading" ? "atlas-spin" : ""}>
              {aiState === "loading" ? <Loader2 size={15} /> : <Wand2 size={15} />}
            </span>
            {aiState === "loading" ? "Generating…" : "Generate description with AI"}
          </Button>
          {aiState === "error" && (
            <div style={{ fontSize: 12, color: "var(--danger)" }}>
              Couldn't reach the generator. Write the description manually below.
            </div>
          )}

          <Field label="Description">
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={5} placeholder="Role summary and responsibilities…" style={{ ...inputStyle, resize: "vertical" }} />
          </Field>

          <Field label="Requirements (one per line)">
            <textarea value={form.requirements} onChange={e => set("requirements", e.target.value)}
              rows={4} placeholder={"5+ years experience\nStrong communication"} style={{ ...inputStyle, resize: "vertical" }} />
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <Button type="submit" icon={CheckCircle2}>Publish role</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
