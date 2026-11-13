"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
    else { setSuccess(true); setLoading(false); }
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  const inputStyle = {
    background: "#0a0a0a", border: "1px solid #333", borderRadius: "3px",
    padding: "10px 14px", fontSize: "15px", color: "#fff", outline: "none", width: "100%",
    boxSizing: "border-box" as const,
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a", display: "flex",
        alignItems: "center", justifyContent: "center", padding: "24px 16px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}>
        <div style={{
          width: "100%", maxWidth: "400px", border: "1px solid #222",
          borderRadius: "4px", padding: "40px 36px", background: "#111", textAlign: "center",
        }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#adff2f", marginBottom: "20px", textTransform: "uppercase" }}>
            MEDTRACKER
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
            Check your email
          </h2>
          <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.6, margin: "0 0 28px" }}>
            We sent a confirmation link to <span style={{ color: "#ccc" }}>{email}</span>.<br />
            Click it to activate your account, then sign in.
          </p>
          <Link href="/login" style={{
            display: "block", background: "#adff2f", color: "#0a0a0a", borderRadius: "3px",
            padding: "12px", fontSize: "14px", fontWeight: 700, textDecoration: "none",
            textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "24px 16px",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", border: "1px solid #222",
        borderRadius: "4px", padding: "40px 36px", background: "#111",
      }}>
        {/* Brand */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#adff2f", marginBottom: "8px", textTransform: "uppercase" }}>
            MEDTRACKER
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
            Create account
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: "6px 0 0" }}>
            Free forever — no credit card needed
          </p>
        </div>

        {error && (
          <div style={{
            background: "#1a0000", border: "1px solid #440000", color: "#ff4444",
            borderRadius: "3px", padding: "10px 14px", fontSize: "13px", marginBottom: "20px",
          }}>{error}</div>
        )}

        {/* Google first */}
        <button onClick={handleGoogleSignup} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          width: "100%", border: "1px solid #333", background: "#0a0a0a", borderRadius: "3px",
          padding: "11px", fontSize: "14px", fontWeight: 500, color: "#ccc", cursor: "pointer",
          marginBottom: "20px",
        }}
          onMouseOver={e => (e.currentTarget.style.borderColor = "#555")}
          onMouseOut={e => (e.currentTarget.style.borderColor = "#333")}
        >
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.1-11.3-7.5l-6.6 5.1C9.4 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C36.9 36.9 44 31.5 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Sign up with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "#222" }} />
          <span style={{ color: "#555", fontSize: "12px" }}>or sign up with email</span>
          <div style={{ flex: 1, height: "1px", background: "#222" }} />
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { label: "Full name", type: "text", value: fullName, setter: setFullName, placeholder: "Your name", autocomplete: "name" },
            { label: "Email", type: "email", value: email, setter: setEmail, placeholder: "you@example.com", autocomplete: "email" },
            { label: "Password", hint: "min 6 chars", type: "password", value: password, setter: setPassword, placeholder: "••••••••", autocomplete: "new-password" },
            { label: "Confirm password", type: "password", value: confirm, setter: setConfirm, placeholder: "••••••••", autocomplete: "new-password" },
          ].map(({ label, hint, type, value, setter, placeholder, autocomplete }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
                <span>{label}</span>
                {hint && <span style={{ color: "#555", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{hint}</span>}
              </label>
              <input
                type={type} required value={value} placeholder={placeholder}
                autoComplete={autocomplete}
                onChange={e => setter(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#adff2f"}
                onBlur={e => e.target.style.borderColor = "#333"}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            background: "#adff2f", color: "#0a0a0a", border: "none", borderRadius: "3px",
            padding: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "4px",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "24px", marginBottom: 0 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#adff2f", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
