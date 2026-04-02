import { supabase } from "./supabaseClient";
import { uploadAvatar, deleteImage } from "./storage";
import { type Profile } from "../types";

export async function getProfile(): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(
  currentProfile: Profile,
  newUsername: string,
  newImageFile: File | null,
  removeAvatar: boolean,
): Promise<void> {
  let avatarPath = currentProfile.avatar_url;

  if (removeAvatar) {
    // delete from storage if it exists
    if (currentProfile.avatar_url) await deleteImage(currentProfile.avatar_url);
    avatarPath = null;
  } else if (newImageFile) {
    // delete old avatar and upload new one
    if (currentProfile.avatar_url) await deleteImage(currentProfile.avatar_url);
    avatarPath = await uploadAvatar(currentProfile.id, newImageFile);
  }

  const usernameChanged = newUsername.trim() !== currentProfile.username;

  const { error } = await supabase.rpc("update_profile", {
    p_username: usernameChanged ? newUsername.trim() : null,
    p_avatar_path: avatarPath !== currentProfile.avatar_url ? avatarPath : null,
    p_remove_avatar: removeAvatar,
  });

  if (error) throw new Error(error.message);
}
