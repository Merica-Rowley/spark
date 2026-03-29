import { supabase } from "./supabaseClient";
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

  if (error) throw error;

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

export async function deleteList(listId: string): Promise<void> {
  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) throw error;
}
