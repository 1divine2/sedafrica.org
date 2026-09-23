import React, { useState, useCallback } from "react";
import { useAuth } from "../AuthContext";

interface Toast {
  id: number;
  type: "success" | "error";
  title: string;
  message: string;
}

let toastId = 0;

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: "success" | "error", title: string, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4500);
  }, []);

  function removeToast(id: number) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true, ...t } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 350);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === "login") {
      const result = await signIn(email, password);
      if (result) {
        setError(result);
        addToast("error", "Sign In Failed", result);
      }
    } else {
      const result = await signUp(email, password, fullName);
      if (result) {
        setError(result);
        addToast("error", "Account Creation Failed", result);
      } else {
        addToast("success", "Account Created", "Welcome! Your admin account has been set up.");
      }
    }
    setSubmitting(false);
  }

  return (
    <div className="login-page">
      <div className="admin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast admin-toast-${t.type}`} role="alert">
            <span className="admin-toast-icon">
              {t.type === "success" ? "\u2713" : "\u2717"}
            </span>
            <div className="admin-toast-body">
              <div className="admin-toast-title">{t.title}</div>
              <div className="admin-toast-message">{t.message}</div>
            </div>
            <button
              className="admin-toast-close"
              aria-label="Dismiss"
              onClick={() => removeToast(t.id)}
            >
              &times;
            </button>
            <span className="admin-toast-progress" style={{ animationDuration: "4500ms" }} />
          </div>
        ))}
      </div>

      <div className="login-card">
        <div className="login-brand">
          <img src="/seda-logo.jpg" alt="SEDA" />
          <h1>SEDA Admin Portal</h1>
          <p>Content Management System</p>
        </div>

        <div className="login-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => { setMode("login"); setError(null); }}
          >
            Sign In
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => { setMode("signup"); setError(null); }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "signup" && (
            <label>
              Full Name
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sedafrica.org"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              minLength={6}
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
