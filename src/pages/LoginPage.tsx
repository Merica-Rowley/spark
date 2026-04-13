import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  HiEnvelope,
  HiLockClosed,
  HiExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi2";
import { supabase } from "../lib/supabaseClient";
import { acceptInvite } from "../lib/friends";
import styles from "./LoginPage.module.css";
import clsx from "clsx";
import Logo from "../assets/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("signup") === "true" ? "signup" : "login",
  );

  const handleModeSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  async function handlePendingInvite() {
    const pendingCode = localStorage.getItem("pendingInviteCode");
    if (!pendingCode) {
      navigate("/lists");
      return;
    }
    try {
      await acceptInvite(pendingCode);
      localStorage.removeItem("pendingInviteCode");
      navigate("/friends");
    } catch {
      localStorage.removeItem("pendingInviteCode");
      navigate("/lists");
    }
  }

  const signUp = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else {
      const hasPendingInvite = !!localStorage.getItem("pendingInviteCode");
      setSuccessMessage(
        hasPendingInvite
          ? "Check your email to confirm your account! Your friend invite will be waiting when you log in."
          : "Check your email to confirm your account!",
      );
    }
    setLoading(false);
  };

  const signIn = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await handlePendingInvite();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (mode === "login") signIn();
      else signUp();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Branding */}
        <div className={styles.branding}>
          <div className={styles.logoPlaceholder}>
            <Logo size={54} />
          </div>
          <h1 className={styles.appName}>Spark</h1>
          <p className={styles.tagline}>
            Complete your bucket list together with the people who matter most.
          </p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={clsx(styles.tab, mode === "login" && styles.tabActive)}
              onClick={() => handleModeSwitch("login")}
            >
              Log In
            </button>
            <button
              className={clsx(
                styles.tab,
                mode === "signup" && styles.tabActive,
              )}
              onClick={() => handleModeSwitch("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className={styles.form} onKeyDown={handleKeyDown}>
            {/* Alert messages */}
            {error && (
              <div className={clsx(styles.alert, styles.alertError)}>
                <HiExclamationCircle
                  size={18}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                {error}
              </div>
            )}
            {successMessage && (
              <div className={clsx(styles.alert, styles.alertSuccess)}>
                <HiCheckCircle
                  size={18}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                {successMessage}
              </div>
            )}

            {/* Email */}
            <div className={styles.formField}>
              <label className={styles.label}>
                <HiEnvelope
                  size={14}
                  style={{ display: "inline", marginRight: 6 }}
                />
                Email
              </label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className={styles.formField}>
              <label className={styles.label}>
                <HiLockClosed
                  size={14}
                  style={{ display: "inline", marginRight: 6 }}
                />
                Password
              </label>
              <input
                className={styles.input}
                type="password"
                placeholder={
                  mode === "signup"
                    ? "Create a password"
                    : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
            </div>

            {/* Submit */}
            <button
              className={clsx("btn btn-primary", styles.submitButton)}
              onClick={mode === "login" ? signIn : signUp}
              disabled={loading || !email || !password}
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Log In"
                  : "Create Account"}
            </button>
          </div>

          {/* Footer note */}
          <p className={styles.footer}>
            {mode === "login"
              ? "Don't have an account? Click Sign Up above."
              : "Already have an account? Click Log In above."}
          </p>
        </div>
      </div>
    </div>
  );
}
