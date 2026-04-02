import { useState, useEffect } from "react";
import { getProfileById } from "../lib/profile";
import { type Profile } from "../types";

export function useFriendProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfileById(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }

  return { profile, loading, error };
}
