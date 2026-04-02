import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { acceptInvite, getInviteByCode } from "../lib/friends";

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
      // check if invite is valid first
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

      // check if user is logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        setStatus("ready");
      } else {
        // store invite code in session storage so we can use it after signup
        sessionStorage.setItem("pendingInviteCode", code!);
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
      sessionStorage.removeItem("pendingInviteCode");
      setStatus("success");
      setTimeout(() => navigate("/friends"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
      setStatus("error");
    }
  }

  if (status === "loading") return <div>Checking invite...</div>;

  if (status === "error")
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate("/lists")}>Go to App</button>
      </div>
    );

  if (status === "success")
    return (
      <div>
        <p>You are now friends! Redirecting...</p>
      </div>
    );

  // status === 'ready'
  if (!isAuthenticated) {
    return (
      <div>
        <h1>You've been invited to Spark! ⚡</h1>
        <p>Create an account to connect with your friend.</p>
        <button onClick={() => navigate("/login?signup=true")}>
          Create Account
        </button>
        <button onClick={() => navigate("/login")}>
          I already have an account
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Friend Invite</h1>
      <p>You've received a friend invite. Would you like to accept it?</p>
      <button onClick={() => navigate("/lists")}>Decline</button>
      <button onClick={handleAccept}>Accept</button>
    </div>
  );
}
