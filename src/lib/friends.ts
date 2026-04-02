import { supabase } from "./supabaseClient";
import { type Friend, type FriendInvite } from "../types";

export async function getFriends(): Promise<Friend[]> {
  const { data, error } = await supabase.rpc("get_friends");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function removeFriend(friendId: string): Promise<void> {
  const { error } = await supabase.rpc("remove_friend", {
    p_friend_id: friendId,
  });
  if (error) throw new Error(error.message);
}

export async function generateInvite(): Promise<string> {
  const { data, error } = await supabase.rpc("generate_invite");
  if (error) throw new Error(error.message);
  return data;
}

export async function acceptInvite(
  inviteCode: string,
): Promise<{ friend_id: string }> {
  const { data, error } = await supabase.rpc("accept_invite", {
    p_invite_code: inviteCode,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getInviteByCode(
  inviteCode: string,
): Promise<FriendInvite | null> {
  const { data, error } = await supabase.rpc("get_invite_by_code", {
    p_invite_code: inviteCode,
  });
  if (error) throw new Error(error.message);
  return data;
}
