import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const signUp = async (): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email to confirm your account!");
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
      navigate("/lists");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Spark ⚡</h1>
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
      <button onClick={signUp} disabled={loading || !email || !password}>
        Sign Up
      </button>
      <button onClick={signIn} disabled={loading || !email || !password}>
        Log In
      </button>
    </div>
  );
}
