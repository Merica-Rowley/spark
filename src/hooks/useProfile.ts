import { useState } from "react";
import { getProfileById, updateProfile } from "../lib/profile";
import { type Profile } from "../types";
import { useAuth } from "../context/AuthContext";

export function useProfile() {
  const { profile: authProfile } = useAuth();
  const [profile, setProfile] = useState<Profile>(authProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfileById(authProfile.id);
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
    try {
      await updateProfile(profile, newUsername, newImageFile, removeAvatar);
      await fetchProfile(); // refetch to get updated data
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
