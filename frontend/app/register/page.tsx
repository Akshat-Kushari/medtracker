// Save to: frontend/app/register/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [loading, setLoading]     = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Check your email!</h2>
          <p className="success-text">
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Click it to activate your account, then sign in.
          </p>
          <Link href="/login" className="auth-btn-primary" style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 24 }}>
            Go to Sign In
          </Link>
        </div>
        <style jsx>{`
          .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0f9ff,#e0f2fe 50%,#f0fdf4); padding:24px 16px; }
          .auth-card { background:#fff; border-radius:16px; box-shadow:0 4px 32px rgba(0,0,0,0.10); padding:40px 36px; width:100%; max-width:420px; text-align:center; }
          .success-icon { font-size:48px; margin-bottom:16px; }
          .success-title { font-size:22px; font-weight:700; color:#0f172a; margin:0 0 12px; }
          .success-text { color:#64748b; font-size:15px; line-height:1.6; margin:0; }
          .auth-btn-primary { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; border-radius:8px; padding:12px; font-size:15px; font-weight:600; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-logo">💊</span>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Free forever — no credit card needed</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Google first */}
        <button onClick={handleGoogleSignup} className="auth-btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.1-11.3-7.5l-6.6 5.1C9.4 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C36.9 36.9 44 31.5 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="auth-divider"><span>or sign up with email</span></div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="auth-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="Akshat Kushari"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password <span className="hint">(min 6 chars)</span></label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              required
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f0f9ff,#e0f2fe 50%,#f0fdf4); padding:24px 16px; }
        .auth-card { background:#fff; border-radius:16px; box-shadow:0 4px 32px rgba(0,0,0,0.10); padding:40px 36px; width:100%; max-width:420px; }
        .auth-brand { text-align:center; margin-bottom:24px; }
        .auth-logo { font-size:36px; display:block; margin-bottom:8px; }
        .auth-title { font-size:26px; font-weight:700; color:#0f172a; margin:0 0 4px; }
        .auth-subtitle { color:#64748b; font-size:14px; margin:0; }
        .auth-error { background:#fef2f2; border:1px solid #fecaca; color:#dc2626; border-radius:8px; padding:10px 14px; font-size:14px; margin-bottom:16px; }
        .auth-btn-google { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; border:1.5px solid #e2e8f0; background:#fff; border-radius:8px; padding:11px; font-size:15px; font-weight:500; color:#374151; cursor:pointer; transition:background 0.2s; }
        .auth-btn-google:hover { background:#f8fafc; }
        .auth-divider { display:flex; align-items:center; gap:12px; margin:20px 0; color:#94a3b8; font-size:13px; }
        .auth-divider::before,.auth-divider::after { content:''; flex:1; height:1px; background:#e2e8f0; }
        .auth-form { display:flex; flex-direction:column; gap:14px; }
        .auth-field { display:flex; flex-direction:column; gap:6px; }
        .auth-field label { font-size:14px; font-weight:600; color:#374151; }
        .hint { font-weight:400; color:#94a3b8; font-size:12px; }
        .auth-field input { border:1.5px solid #e2e8f0; border-radius:8px; padding:10px 14px; font-size:15px; outline:none; transition:border 0.2s; color:#0f172a; }
        .auth-field input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.12); }
        .auth-btn-primary { background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; border:none; border-radius:8px; padding:12px; font-size:15px; font-weight:600; cursor:pointer; margin-top:4px; transition:opacity 0.2s; }
        .auth-btn-primary:hover { opacity:0.9; }
        .auth-btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
        .auth-switch { text-align:center; font-size:14px; color:#64748b; margin-top:20px; margin-bottom:0; }
        .auth-switch a { color:#2563eb; font-weight:600; text-decoration:none; }
        .auth-switch a:hover { text-decoration:underline; }
      `}</style>
    </div>
  );
}
