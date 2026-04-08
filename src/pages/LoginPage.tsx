import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { acceptInvite } from "../lib/friends";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // if redirected from invite page, default to signup tab
  const [mode, setMode] = useState<"login" | "signup">(
    searchParams.get("signup") === "true" ? "signup" : "login",
  );

  async function handlePendingInvite() {
    const pendingCode = sessionStorage.getItem("pendingInviteCode");
    if (!pendingCode) {
      navigate("/lists"); // no pending invite, just go to lists
      return;
    }

    try {
      await acceptInvite(pendingCode);
      sessionStorage.removeItem("pendingInviteCode");
      navigate("/friends");
    } catch (err) {
      // invite may have expired or already been used — just continue to app
      sessionStorage.removeItem("pendingInviteCode");
      navigate("/lists");
    }
  }

  const signUp = async (): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://username.github.io/repo-name/auth/callback",
      },
    });
    if (error) {
      alert(error.message);
    } else {
      const hasPendingInvite = !!sessionStorage.getItem("pendingInviteCode");
      if (hasPendingInvite) {
        alert(
          "Check your email to confirm your account! Your friend invite will be waiting when you log in.",
        );
      } else {
        alert("Check your email to confirm your account!");
      }
    }
    setLoading(false);
  };

  const signIn = async (): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      await handlePendingInvite();
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Spark ⚡</h1>

      <div>
        <button onClick={() => setMode("login")}>Log In</button>
        <button onClick={() => setMode("signup")}>Sign Up</button>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {mode === "signup" ? (
        <button onClick={signUp} disabled={loading || !email || !password}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      ) : (
        <button onClick={signIn} disabled={loading || !email || !password}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      )}
    </div>
  );
}
