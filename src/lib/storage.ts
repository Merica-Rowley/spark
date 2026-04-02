import { supabase } from "./supabaseClient";

export async function uploadListImage(
  listId: string,
  file: File,
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `lists/${listId}/cover.${fileExt}`;

  // remove old image first if it exists
  await supabase.storage.from("images").remove([filePath]);

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(error.message);

  return filePath;
}

export async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(path, 3600); // expires in 1 hour

  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function deleteImage(imagePath: string): Promise<void> {
  // never delete the default placeholder
  if (imagePath === "defaults/default-list-cover.svg") return;

  const { error } = await supabase.storage.from("images").remove([imagePath]);

  if (error) throw new Error(error.message);
}

export function getDicebearUrl(userId: string): string {
  return `https://api.dicebear.com/7.x/rings/svg?seed=${encodeURIComponent(userId)}`;
}

export async function getAvatarUrl(
  avatarPath: string | null,
  userId: string,
): Promise<string> {
  if (!avatarPath) return getDicebearUrl(userId);
  try {
    return await getSignedUrl(avatarPath);
  } catch {
    return getDicebearUrl(userId);
  }
}

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `avatars/${userId}/avatar.${fileExt}`;

  // remove old avatar first
  await supabase.storage.from("images").remove([filePath]);

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) throw new Error(error.message);
  return filePath;
}
