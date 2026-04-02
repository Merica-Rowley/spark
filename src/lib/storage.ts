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
