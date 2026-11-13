// Save to: frontend/app/login/page.tsx

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

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <span className="auth-logo">💊</span>
          <h1 className="auth-title">MedTracker</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">
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
            <label htmlFor="password">
              Password
              <Link href="/forgot-password" className="auth-forgot">
                Forgot password?
              </Link>
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        {/* Google */}
        <button onClick={handleGoogleLogin} className="auth-btn-google">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.1-11.3-7.5l-6.6 5.1C9.4 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C36.9 36.9 44 31.5 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
          Continue with Google
        </button>

        {/* Switch to register */}
        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create one free</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%);
          padding: 24px 16px;
        }
        .auth-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
        }
        .auth-brand {
          text-align: center;
          margin-bottom: 28px;
        }
        .auth-logo {
          font-size: 36px;
          display: block;
          margin-bottom: 8px;
        }
        .auth-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .auth-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .auth-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          margin-bottom: 16px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-field label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .auth-forgot {
          font-size: 13px;
          color: #2563eb;
          font-weight: 400;
          text-decoration: none;
        }
        .auth-forgot:hover { text-decoration: underline; }
        .auth-field input {
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 15px;
          outline: none;
          transition: border 0.2s;
          color: #0f172a;
        }
        .auth-field input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }
        .auth-btn-primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 4px;
          transition: opacity 0.2s;
        }
        .auth-btn-primary:hover { opacity: 0.9; }
        .auth-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
          color: #94a3b8;
          font-size: 13px;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }
        .auth-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          border-radius: 8px;
          padding: 11px;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: background 0.2s;
        }
        .auth-btn-google:hover { background: #f8fafc; }
        .auth-switch {
          text-align: center;
          font-size: 14px;
          color: #64748b;
          margin-top: 20px;
          margin-bottom: 0;
        }
        .auth-switch a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
        .auth-switch a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
