import { supabase } from "./supabaseClient";
import { uploadImage } from "./storage";
import { type ListMemberWithProfile, type PostWithMeta } from "../types";

export async function createPost(
  listItemId: string,
  content: string | null,
  imageFile: File | null,
  participantIds: string[],
  userId: string, // pass in from component
): Promise<string> {
  let imagePath: string | null = null;

  if (imageFile) {
    imagePath = await uploadImage(
      `posts/${userId}/${crypto.randomUUID()}`,
      imageFile,
    );
  }

  const { data, error } = await supabase.rpc("create_post", {
    p_list_item_id: listItemId,
    p_content: content,
    p_image_path: imagePath,
    p_participant_ids: participantIds,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function deletePost(postId: string): Promise<void> {
  const { error } = await supabase.rpc("delete_post", {
    p_post_id: postId,
  });
  if (error) throw new Error(error.message);
}

export async function addPostParticipant(
  postId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase.rpc("add_post_participant", {
    p_post_id: postId,
    p_user_id: userId,
  });
  if (error) throw new Error(error.message);
}

export async function removePostParticipant(
  postId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase.rpc("remove_post_participant", {
    p_post_id: postId,
    p_user_id: userId,
  });
  if (error) throw new Error(error.message);
}

export async function getFeed(): Promise<PostWithMeta[]> {
  const { data, error } = await supabase.rpc("get_feed");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProfilePosts(userId: string): Promise<PostWithMeta[]> {
  const { data, error } = await supabase.rpc("get_profile_posts", {
    p_user_id: userId,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markPostViewed(postId: string): Promise<void> {
  const { error } = await supabase.rpc("mark_post_viewed", {
    p_post_id: postId,
  });
  if (error) throw new Error(error.message);
}

export async function toggleReaction(
  postId: string,
): Promise<{ user_reacted: boolean; reaction_count: number }> {
  const { data, error } = await supabase.rpc("toggle_reaction", {
    p_post_id: postId,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getListMembersForPost(
  postId: string,
): Promise<ListMemberWithProfile[]> {
  const { data, error } = await supabase.rpc("get_list_members_for_post", {
    p_post_id: postId,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPostById(
  postId: string,
): Promise<PostWithMeta | null> {
  const { data, error } = await supabase.rpc("get_post_by_id", {
    p_post_id: postId,
  });
  if (error) throw new Error(error.message);
  return data;
}
