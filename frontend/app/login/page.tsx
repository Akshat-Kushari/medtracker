"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/"); router.refresh(); }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "Arial, Helvetica, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        border: "1px solid #222",
        borderRadius: "4px",
        padding: "40px 36px",
        background: "#111",
      }}>
        {/* Brand */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#adff2f", marginBottom: "8px", textTransform: "uppercase" }}>
            MEDTRACKER
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
            Sign in
          </h1>
          <p style={{ color: "#555", fontSize: "14px", margin: "6px 0 0" }}>
            Welcome back
          </p>
        </div>

        {error && (
          <div style={{
            background: "#1a0000",
            border: "1px solid #440000",
            color: "#ff4444",
            borderRadius: "3px",
            padding: "10px 14px",
            fontSize: "13px",
            marginBottom: "20px",
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Email
            </label>
            <input
              type="email" required autoComplete="email"
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                background: "#0a0a0a", border: "1px solid #333", borderRadius: "3px",
                padding: "10px 14px", fontSize: "15px", color: "#fff", outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#adff2f"}
              onBlur={e => e.target.style.borderColor = "#333"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Password
              </label>
              <Link href="/forgot-password" style={{ fontSize: "12px", color: "#adff2f", textDecoration: "none" }}>
                Forgot?
              </Link>
            </div>
            <input
              type="password" required autoComplete="current-password"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{
                background: "#0a0a0a", border: "1px solid #333", borderRadius: "3px",
                padding: "10px 14px", fontSize: "15px", color: "#fff", outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#adff2f"}
              onBlur={e => e.target.style.borderColor = "#333"}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            background: "#adff2f", color: "#0a0a0a", border: "none", borderRadius: "3px",
            padding: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "4px",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0", color: "#333", fontSize: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "#222" }} />
          <span style={{ color: "#555" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#222" }} />
        </div>

        <button onClick={handleGoogleLogin} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          width: "100%", border: "1px solid #333", background: "#0a0a0a", borderRadius: "3px",
          padding: "11px", fontSize: "14px", fontWeight: 500, color: "#ccc", cursor: "pointer",
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
          Continue with Google
        </button>

        <p style={{ textAlign: "center", fontSize: "13px", color: "#555", marginTop: "24px", marginBottom: 0 }}>
          No account?{" "}
          <Link href="/register" style={{ color: "#adff2f", fontWeight: 600, textDecoration: "none" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
