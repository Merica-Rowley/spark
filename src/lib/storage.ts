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

export async function uploadImage(path: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${path}.${fileExt}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
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
  const timestamp = Date.now();
  const filePath = `avatars/${userId}/avatar_${timestamp}.${fileExt}`;

  // remove all old avatars for this user first
  const { data: existing } = await supabase.storage
    .from("images")
    .list(`avatars/${userId}`);

  if (existing && existing.length > 0) {
    const oldFiles = existing.map((f) => `avatars/${userId}/${f.name}`);
    await supabase.storage.from("images").remove(oldFiles);
  }

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;
  return filePath;
}
