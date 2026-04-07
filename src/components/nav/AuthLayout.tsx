import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { getProfile } from "../../lib/profile";
import { type Profile } from "../../types";
import NavBar from "./NavBar";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setAuthenticated(false);
          setLoading(false);
        } else {
          checkAuthAndProfile();
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkAuthAndProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      const profileData = await getProfile();
      setProfile(profileData);
      setAuthenticated(true);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <NavBar profile={profile} />
      <main style={{ padding: "24px" }}>{children}</main>
    </div>
  );
}
