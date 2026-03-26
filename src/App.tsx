import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import type { User } from "@supabase/supabase-js";

function App() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (): Promise<void> => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm your account!");
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
    }

    setLoading(false);
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Spark ⚡</h1>

      {user ? (
        <div>
          <p>Logged in as {user.email}</p>
          <button onClick={signOut} disabled={loading}>
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={signUp} disabled={loading || !email || !password}>
            Sign Up
          </button>

          <button onClick={signIn} disabled={loading || !email || !password}>
            Log In
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
