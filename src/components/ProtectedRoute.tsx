import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (user === undefined) return <div>Loading...</div>; // still checking auth
  if (user === null) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
