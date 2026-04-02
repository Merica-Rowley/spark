import { supabase } from "./supabaseClient";
import { deleteImage, uploadListImage } from "./storage";
import { type ListWithMeta } from "../types";

export async function getUserLists(): Promise<ListWithMeta[]> {
  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      *,
      list_members!inner(role),
      starred_lists(user_id)
    `,
    )
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data
    .map((list) => ({
      ...list,
      is_starred: list.starred_lists.length > 0,
      role: list.list_members[0].role,
    }))
    .sort((a, b) => {
      if (a.is_starred && !b.is_starred) return -1;
      if (!a.is_starred && b.is_starred) return 1;
      return 0;
    });
}

export async function deleteList(
  listId: string,
  imagePath: string | null,
): Promise<void> {
  if (imagePath) {
    await deleteImage(imagePath);
  }

  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) throw new Error(error.message);
}

export async function updateList(
  listId: string,
  title: string,
  currentImagePath: string | null,
  newImageFile: File | null,
  resetImage: boolean = false,
): Promise<void> {
  let imagePath = currentImagePath;

  if (resetImage) {
    // delete current image if it isn't already the default
    if (currentImagePath) await deleteImage(currentImagePath);
    imagePath = null;
  } else if (newImageFile) {
    // delete old image and upload new one
    if (currentImagePath) await deleteImage(currentImagePath);
    imagePath = await uploadListImage(listId, newImageFile);
  }

  const { error } = await supabase.rpc("update_list", {
    p_list_id: listId,
    p_title: title,
    p_image_path: imagePath,
    p_reset_image: resetImage,
  });

  if (error) throw new Error(error.message);
}

export async function starList(listId: string): Promise<void> {
  const { error } = await supabase.rpc("star_list", { p_list_id: listId });
  if (error) throw new Error(error.message);
}

export async function unstarList(listId: string): Promise<void> {
  const { error } = await supabase.rpc("unstar_list", { p_list_id: listId });
  if (error) throw new Error(error.message);
}
