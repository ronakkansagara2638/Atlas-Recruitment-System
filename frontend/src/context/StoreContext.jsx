import React, { createContext, useContext, useReducer, useEffect } from "react";
import { SEED_JOBS, INITIAL_USERS, MASTER_ADMIN, SEED_AUDIT_LOGS, makeCandidate, calculateAtsScore, nextId } from "../constants/recruitmentData";

const STORAGE_KEY_USERS = "atlas_hrms_users";
const STORAGE_KEY_SESSION = "atlas_hrms_session";
const STORAGE_KEY_AUDIT = "atlas_hrms_audit_logs";

function getInitialUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasMaster = parsed.some(u => u.email.toLowerCase() === MASTER_ADMIN.email.toLowerCase());
      return hasMaster ? parsed : [MASTER_ADMIN, ...parsed];
    }
  } catch (e) {}
  return INITIAL_USERS;
}

function getInitialSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SESSION);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function getInitialAuditLogs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return SEED_AUDIT_LOGS;
}

const initialUsers = getInitialUsers();
const initialUser = getInitialSession();
const initialAuditLogs = getInitialAuditLogs();

export const initialState = {
  user: initialUser,
  users: initialUsers,
  auditLogs: initialAuditLogs,
  isAuthenticated: Boolean(initialUser),
  role: initialUser ? initialUser.role : "candidate",
  jobs: SEED_JOBS,
  selectedJobId: null,
  toast: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      const loggedUser = action.user;
      try {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(loggedUser));
      } catch (e) {}

      // Log audit
      const newLog = {
        id: "log-" + nextId(),
        userId: loggedUser.id,
        userName: loggedUser.name,
        userRole: loggedUser.role,
        action: "User Sign In",
        target: "System Portal",
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      };
      const updatedLogs = [newLog, ...state.auditLogs];
      try { localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updatedLogs)); } catch (e) {}

      return {
        ...state,
        user: loggedUser,
        role: loggedUser.role,
        isAuthenticated: true,
        auditLogs: updatedLogs,
        selectedJobId: null,
        toast: { kind: "success", msg: `Welcome back, ${loggedUser.name}!` },
      };
    }

    case "SIGNUP":
    case "REGISTER_USER": {
      // Disallow Admin role in public registration
      if (action.userData.role === "admin") {
        return { ...state, toast: { kind: "danger", msg: "Admin role registration is restricted." } };
      }

      const newUser = {
        id: "user-" + nextId(),
        createdAt: new Date().toISOString().slice(0, 10),
        ...action.userData,
      };
      const updatedUsers = [...state.users, newUser];
      try {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));
      } catch (e) {}

      return {
        ...state,
        users: updatedUsers,
        user: newUser,
        role: newUser.role,
        isAuthenticated: true,
        toast: { kind: "success", msg: `Account created successfully. Welcome, ${newUser.name}!` },
      };
    }

    case "LOGOUT": {
      try {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      } catch (e) {}
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        role: "candidate",
        toast: { kind: "info", msg: "Logged out successfully." },
      };
    }

    case "LOG_RESUME_ACCESS": {
      const { candidateName, jobId, actionName } = action;
      const currentUser = state.user || { id: "anon", name: "User", role: state.role };
      const newLog = {
        id: "log-" + nextId(),
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: actionName || "Viewed Private Candidate Resume",
        target: `${candidateName} (${jobId})`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      };
      const updatedLogs = [newLog, ...state.auditLogs];
      try { localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updatedLogs)); } catch (e) {}
      return { ...state, auditLogs: updatedLogs };
    }

    case "UPDATE_JOB_STATUS": {
      const { jobId, newStatus } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j),
        toast: { kind: "info", msg: `Job status updated to ${newStatus}.` },
      };
    }

    case "UPDATE_USER_ROLE": {
      const updatedUsers = state.users.map(u => u.id === action.userId ? { ...u, role: action.newRole } : u);
      try {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
      } catch (e) {}
      const updatedCurrentUser = state.user?.id === action.userId ? { ...state.user, role: action.newRole } : state.user;
      return {
        ...state,
        users: updatedUsers,
        user: updatedCurrentUser,
        role: updatedCurrentUser ? updatedCurrentUser.role : state.role,
        toast: { kind: "success", msg: "User role updated." },
      };
    }

    case "DELETE_USER": {
      const updatedUsers = state.users.filter(u => u.id !== action.userId);
      try {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(updatedUsers));
      } catch (e) {}
      return {
        ...state,
        users: updatedUsers,
        toast: { kind: "info", msg: "User account deleted." },
      };
    }

    case "SET_ROLE": {
      return { ...state, role: action.role, selectedJobId: null };
    }

    case "SELECT_JOB":
      return { ...state, selectedJobId: action.jobId };

    case "CREATE_JOB": {
      const job = {
        id: "job-" + nextId(),
        status: action.job.status || "Published",
        createdAt: new Date().toISOString().slice(0, 10),
        candidates: [],
        ...action.job,
      };
      return { ...state, jobs: [job, ...state.jobs], toast: { kind: "success", msg: `“${job.title}” posted.` } };
    }

    case "APPLY_JOB":
    case "APPLY_TO_JOB":
    case "APPLY_JOB_WITH_RESUME": {
      const targetJob = state.jobs.find(j => j.id === action.jobId);
      if (!targetJob) return state;

      const applicantEmail = action.candidate?.email || action.applicantEmail || state.user?.email || "candidate@atlas.hrms";
      const applicantName = action.candidate?.name || action.applicantName || state.user?.name || "Alex Rivera";

      // Check duplicate application
      const already = targetJob.candidates.some(c => c.email.toLowerCase() === applicantEmail.toLowerCase());
      if (already) {
        return { ...state, toast: { kind: "info", msg: `You have already applied for ${targetJob.title}.` } };
      }

      let newCand;
      if (action.candidate) {
        newCand = action.candidate;
      } else {
        const skills = action.skills || targetJob.requirements || ["React", "JavaScript", "HTML/CSS"];
        const atsResult = calculateAtsScore({ skills, experienceYears: action.expYears || 4, education: action.education || "B.S. Computer Science" }, targetJob.requirements);

        newCand = makeCandidate(applicantName, applicantEmail, "Applied", 0, atsResult.totalScore, {
          skills,
          experienceYears: action.expYears || 4,
          education: action.education || "B.S. Computer Science",
          summary: action.summary || `${applicantName} submitted application with resume.`,
          resumeFileName: action.resumeFileName || "Resume_Document.pdf",
          reqs: targetJob.requirements,
        });
      }

      return {
        ...state,
        jobs: state.jobs.map(j => j.id === action.jobId
          ? { ...j, candidates: [newCand, ...j.candidates] }
          : j),
        toast: { kind: "success", msg: `🎉 Application submitted for ${targetJob.title}! Match score: ${newCand.score || 90}%` },
      };
    }

    case "WITHDRAW_APPLICATION": {
      const { jobId, candidateEmail } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          candidates: j.candidates.filter(c => c.email.toLowerCase() !== candidateEmail.toLowerCase()),
        }),
        toast: { kind: "info", msg: "Application withdrawn successfully." },
      };
    }

    case "MOVE_CANDIDATE": {
      const { jobId, candidateId, stage } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          candidates: j.candidates.map(c => c.id === candidateId ? {
            ...c,
            stage,
            history: [...(c.history || []), { stage, date: new Date().toISOString().slice(0, 10), updatedBy: state.user?.name || "System" }]
          } : c),
        }),
        toast: { kind: "success", msg: `Moved to ${stage}.` },
      };
    }

    case "ADD_INTERVIEW_FEEDBACK": {
      const { jobId, candidateId, feedback } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          candidates: j.candidates.map(c => c.id === candidateId ? {
            ...c,
            interviewFeedback: feedback,
            stage: feedback.verdict || "Selected",
          } : c),
        }),
        toast: { kind: "success", msg: `Interview feedback recorded (${feedback.verdict})!` },
      };
    }

    case "ADD_CANDIDATE": {
      const { jobId, candidate } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id === jobId
          ? { ...j, candidates: [candidate, ...j.candidates] }
          : j),
        toast: { kind: "success", msg: `Candidate ${candidate.name} added with ${candidate.score}% match score!` },
      };
    }

    case "SCHEDULE_INTERVIEW": {
      const { jobId, candidateId, interview } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          candidates: j.candidates.map(c => c.id === candidateId ? {
            ...c,
            interview,
            stage: "Interview Scheduled",
          } : c),
        }),
        toast: { kind: "success", msg: `Interview scheduled for ${interview.date} at ${interview.time}.` },
      };
    }

    case "SAVE_AI_INTERVIEW_RESULT": {
      const { jobId, candidateId, assessment } = action;
      return {
        ...state,
        jobs: state.jobs.map(j => j.id !== jobId ? j : {
          ...j,
          candidates: j.candidates.map(c => c.id === candidateId ? {
            ...c,
            assessment,
            score: Math.max(c.score, assessment.score),
          } : c),
        }),
        toast: { kind: "success", msg: `AI Skill Assessment recorded: ${assessment.score}% score!` },
      };
    }

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}

export const StoreCtx = createContext(null);

export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreCtx.Provider value={{ state, dispatch }}>
      {children}
    </StoreCtx.Provider>
  );
}
