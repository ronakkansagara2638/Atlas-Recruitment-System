import React, { useState } from "react";
import { Briefcase, Shield, Users, User, Lock, Mail, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { MASTER_ADMIN } from "../constants/recruitmentData";
import { api, setToken } from "../services/api";

export function AuthView() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("login"); // "login" | "signup"

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupRole, setSignupRole] = useState("candidate");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    const emailClean = loginEmail.trim().toLowerCase();

    // Check master admin
    if (emailClean === MASTER_ADMIN.email.toLowerCase()) {
      if (loginPassword === MASTER_ADMIN.password) {
        dispatch({ type: "LOGIN", user: MASTER_ADMIN });
        return;
      } else {
        setLoginError("Invalid Master Admin password.");
        return;
      }
    }

    // Check other registered users
    const matchedUser = state.users.find(u => u.email.toLowerCase() === emailClean);
    if (!matchedUser) {
      setLoginError("No account found with this email address.");
      return;
    }

    if (matchedUser.password && matchedUser.password !== loginPassword) {
      setLoginError("Incorrect password. Please try again.");
      return;
    }

    dispatch({ type: "LOGIN", user: matchedUser });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!signupName.trim()) {
      setSignupError("Please enter your full name.");
      return;
    }

    const emailClean = signupEmail.trim().toLowerCase();
    if (!emailClean || !emailClean.includes("@")) {
      setSignupError("Please enter a valid email address.");
      return;
    }

    // Admin email attempt block
    if (emailClean === MASTER_ADMIN.email.toLowerCase()) {
      setSignupError("Admin account is restricted. Use the Master Admin email on the Sign In tab.");
      return;
    }

    // Check duplicate
    if (state.users.some(u => u.email.toLowerCase() === emailClean)) {
      setSignupError("An account with this email already exists. Please log in.");
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters long.");
      return;
    }

    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.");
      return;
    }

    // Prevent signing up as admin
    if (signupRole === "admin") {
      setSignupError("Admin accounts cannot be registered publicly.");
      return;
    }

    const candidatePayload = {
      name: signupName.trim(),
      email: emailClean,
      password: signupPassword,
      role: "candidate",
    };

    try {
      const res = await api.register(candidatePayload);
      if (res.token) setToken(res.token);
      dispatch({
        type: "SIGNUP",
        userData: res.user || candidatePayload,
      });
    } catch (err) {
      dispatch({
        type: "SIGNUP",
        userData: candidatePayload,
      });
    }
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex", alignItems: "center",
      justifyContent: "center", background: "linear-gradient(135deg, #14161F 0%, #1F2232 50%, #2A2D42 100%)",
      padding: 24, boxSizing: "border-box", color: "#FFFFFF"
    }}>
      <div style={{
        width: "100%", maxWidth: 440, background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: 20, padding: 36, boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
      }}>

        {/* Header Branding */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 48, height: 48, borderRadius: 14, background: "var(--primary)",
            marginBottom: 12, boxShadow: "0 8px 20px rgba(52,54,142,0.4)"
          }}>
            <Briefcase size={24} color="#FFF" />
          </div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px 0", color: "#FFF" }}>
            Atlas HRMS & ATS
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            Unified Recruitment & Hiring Portal
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div style={{
          display: "flex", background: "rgba(0, 0, 0, 0.3)", borderRadius: 12,
          padding: 4, marginBottom: 24, border: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <button
            onClick={() => { setTab("login"); setLoginError(""); }}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
              background: tab === "login" ? "var(--primary)" : "transparent",
              color: tab === "login" ? "#FFF" : "rgba(255,255,255,0.6)",
              fontWeight: 600, fontSize: 13.5, cursor: "pointer", transition: "all 0.2s ease"
            }}>
            Sign In
          </button>
          <button
            onClick={() => { setTab("signup"); setSignupError(""); }}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 9, border: "none",
              background: tab === "signup" ? "var(--primary)" : "transparent",
              color: tab === "signup" ? "#FFF" : "rgba(255,255,255,0.6)",
              fontWeight: 600, fontSize: 13.5, cursor: "pointer", transition: "all 0.2s ease"
            }}>
            Candidate Sign Up
          </button>
        </div>

        {/* SIGN IN FORM */}
        {tab === "login" && (
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {loginError && (
              <div style={{
                padding: "10px 14px", borderRadius: 10, background: "rgba(190, 61, 61, 0.15)",
                border: "1px solid rgba(190, 61, 61, 0.4)", color: "#FF8E8E", fontSize: 13,
                display: "flex", alignItems: "center", gap: 8
              }}>
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 12, top: 12, color: "rgba(255,255,255,0.4)" }} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px 10px 38px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)",
                    color: "#FFF", fontSize: 13.5, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "rgba(255,255,255,0.4)" }} />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 38px 10px 38px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)",
                    color: "#FFF", fontSize: 13.5, outline: "none", boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ position: "absolute", right: 12, top: 10, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "var(--primary)", color: "#FFF", fontWeight: 600, fontSize: 14,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, marginTop: 6, boxShadow: "0 4px 14px rgba(52,54,142,0.5)"
              }}>
              Sign In to Account <ArrowRight size={16} />
            </button>

            <div style={{
              fontSize: 11.5, color: "rgba(255,255,255,0.5)", textAlign: "center",
              marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)"
            }}>
              * Recruiter & HR Staff log in using credentials authorized by the Admin.
            </div>
          </form>
        )}

        {/* CANDIDATE SIGN UP FORM */}
        {tab === "signup" && (
          <form onSubmit={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {signupError && (
              <div style={{
                padding: "10px 14px", borderRadius: 10, background: "rgba(190, 61, 61, 0.15)",
                border: "1px solid rgba(190, 61, 61, 0.4)", color: "#FF8E8E", fontSize: 13,
                display: "flex", alignItems: "center", gap: 8
              }}>
                <AlertCircle size={16} />
                <span>{signupError}</span>
              </div>
            )}

            <div style={{
              padding: "10px 12px", borderRadius: 8, background: "rgba(46, 111, 176, 0.15)",
              border: "1px solid rgba(46, 111, 176, 0.3)", color: "#76B4EC", fontSize: 12,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <User size={15} />
              <span><strong>Candidate Registration:</strong> Recruiter & HR accounts are created directly by the Admin.</span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)",
                  color: "#FFF", fontSize: 13, outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                style={{
                  width: "100%", padding: "9px 12px", borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)",
                  color: "#FFF", fontSize: 13, outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 12px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)",
                    color: "#FFF", fontSize: 13, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>
                  Confirm
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  style={{
                    width: "100%", padding: "9px 12px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)",
                    color: "#FFF", fontSize: 13, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "var(--primary)", color: "#FFF", fontWeight: 600, fontSize: 14,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, marginTop: 10, boxShadow: "0 4px 14px rgba(52,54,142,0.5)"
              }}>
              Register as Candidate <CheckCircle2 size={16} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
