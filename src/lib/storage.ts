import { supabase } from "./supabaseClient";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";

export async function compressImage(
  file: File,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920,
): Promise<File> {
  let fileToCompress = file;

  // convert HEIC/HEIF to JPEG first
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeic) {
    try {
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      fileToCompress = new File(
        [converted as Blob],
        file.name.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg"),
        { type: "image/jpeg" },
      );
    } catch (err) {
      console.error("HEIC conversion failed:", err);
      // fall through to compression with original file
    }
  }

  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    return await imageCompression(fileToCompress, options);
  } catch (err) {
    console.error("Compression failed:", err);
    return fileToCompress;
  }
}

export async function prepareImageForPreview(file: File): Promise<{
  previewUrl: string;
  convertedFile: File;
}> {
  let fileToUse = file;

  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isHeic) {
    try {
      const converted = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      fileToUse = new File(
        [converted as Blob],
        file.name.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg"),
        { type: "image/jpeg" },
      );
    } catch (err) {
      console.error("HEIC conversion failed:", err);
    }
  }

  return {
    previewUrl: URL.createObjectURL(fileToUse),
    convertedFile: fileToUse,
  };
}

export async function uploadListImage(
  listId: string,
  file: File,
): Promise<string> {
  const compressed = await compressImage(file, 1, 1920); // max 1MB, 1920px
  const filePath = `lists/${listId}/cover.webp`;

  // remove old image first if it exists
  await supabase.storage.from("images").remove([filePath]);

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, compressed, { upsert: true });

  if (error) throw new Error(error.message);

  return filePath;
}

export async function uploadImage(path: string, file: File): Promise<string> {
  const compressed = await compressImage(file, 1, 1920);
  const filePath = `${path}.webp`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, compressed, { upsert: true });

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
  const compressed = await compressImage(file, 0.3, 400); // max 300KB, 400px — avatars are small
  const timestamp = Date.now();
  const filePath = `avatars/${userId}/avatar_${timestamp}.webp`;

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
    .upload(filePath, compressed, { upsert: true });

  if (error) throw error;
  return filePath;
}
