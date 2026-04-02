import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../lib/profile";
import { type Profile } from "../types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(
    newUsername: string,
    newImageFile: File | null,
    removeAvatar: boolean,
  ) {
    if (!profile) return;
    try {
      await updateProfile(profile, newUsername, newImageFile, removeAvatar);
      await fetchProfile();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update profile");
    }
  }

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile: handleUpdateProfile,
  };
}
