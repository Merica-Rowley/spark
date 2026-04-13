import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiUserPlus, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { supabase } from "../lib/supabaseClient";
import { acceptInvite, getInviteByCode } from "../lib/friends";
import styles from "./InvitePage.module.css";
import clsx from "clsx";
import Logo from "../assets/Logo";

export default function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "loading" | "ready" | "error" | "success"
  >("loading");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndInvite();
  }, [code]);

  async function checkAuthAndInvite() {
    try {
      const invite = await getInviteByCode(code!);

      if (!invite) {
        setError("This invite link is invalid.");
        setStatus("error");
        return;
      }

      if (invite.accepted_by) {
        setError("This invite link has already been used.");
        setStatus("error");
        return;
      }

      if (new Date(invite.expires_at) < new Date()) {
        setError("This invite link has expired.");
        setStatus("error");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        setStatus("ready");
      } else {
        localStorage.setItem("pendingInviteCode", code!);
        setStatus("ready");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  async function handleAccept() {
    try {
      setStatus("loading");
      await acceptInvite(code!);
      localStorage.removeItem("pendingInviteCode");
      setStatus("success");
      setTimeout(() => navigate("/friends"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
      setStatus("error");
    }
  }

  // Loading
  if (status === "loading") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.branding}>
            <div className={styles.logoPlaceholder}>
              <Logo size={54} />
            </div>
            <h1 className={styles.appName}>Spark</h1>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div
                className={clsx(styles.statusIcon, styles.statusIconLoading)}
              >
                <div className="spinner" />
              </div>
              <p className={styles.cardTitle}>Checking invite...</p>
              <p className={styles.cardText}>
                Just a moment while we verify your invite link.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (status === "error") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.branding}>
            <div className={styles.logoPlaceholder}>
              <Logo size={54} />
            </div>
            <h1 className={styles.appName}>Spark</h1>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={clsx(styles.statusIcon, styles.statusIconError)}>
                <HiXCircle size={36} />
              </div>
              <p className={styles.cardTitle}>Invalid Invite</p>
              <p className={styles.cardText}>{error}</p>
              <div className={styles.actions}>
                <button
                  className={clsx("btn btn-primary", styles.actionButton)}
                  onClick={() => navigate("/lists")}
                >
                  Go to App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success
  if (status === "success") {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.branding}>
            <div className={styles.logoPlaceholder}>
              <Logo size={54} />
            </div>
            <h1 className={styles.appName}>Spark</h1>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div
                className={clsx(styles.statusIcon, styles.statusIconSuccess)}
              >
                <HiCheckCircle size={36} />
              </div>
              <p className={styles.cardTitle}>You're now friends! 🎉</p>
              <p className={styles.cardText}>
                Redirecting you to your friends list...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ready — unauthenticated user
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.branding}>
            <div className={styles.logoPlaceholder}>
              <Logo size={54} />
            </div>
            <h1 className={styles.appName}>Spark</h1>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={clsx(styles.statusIcon, styles.statusIconInvite)}>
                <HiUserPlus size={32} />
              </div>
              <p className={styles.cardTitle}>You've been invited!</p>
              <p className={styles.cardText}>
                Your friend has invited you to join Spark — the bucket list app
                for sharing adventures with the people who matter most.
              </p>
              <div className={styles.actions}>
                <button
                  className={clsx("btn btn-primary", styles.actionButton)}
                  onClick={() => navigate("/login?signup=true")}
                >
                  Create Account
                </button>
                <div className={styles.divider}>
                  <div className={styles.dividerLine} />
                  <span className={styles.dividerText}>
                    already have an account?
                  </span>
                  <div className={styles.dividerLine} />
                </div>
                <button
                  className={clsx("btn btn-ghost", styles.actionButton)}
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
          <p className={styles.footer}>
            This invite link can only be used once and expires in 7 days.
          </p>
        </div>
      </div>
    );
  }

  // Ready — authenticated user
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <div className={styles.logoPlaceholder}>
            <Logo size={54} />
          </div>
          <h1 className={styles.appName}>Spark</h1>
        </div>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={clsx(styles.statusIcon, styles.statusIconInvite)}>
              <HiUserPlus size={32} />
            </div>
            <p className={styles.cardTitle}>Friend Invite</p>
            <p className={styles.cardText}>
              You've received a friend invite. Would you like to accept it?
            </p>
            <div className={styles.actions}>
              <button
                className={clsx("btn btn-primary", styles.actionButton)}
                onClick={handleAccept}
              >
                <HiCheckCircle size={18} />
                Accept Invite
              </button>
              <button
                className={clsx("btn btn-ghost", styles.actionButton)}
                onClick={() => navigate("/lists")}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
        <p className={styles.footer}>
          This invite link can only be used once and expires in 7 days.
        </p>
      </div>
    </div>
  );
}
