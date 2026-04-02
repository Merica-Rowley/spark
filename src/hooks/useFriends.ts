import { useState, useEffect } from "react";
import { getFriends, removeFriend, generateInvite } from "../lib/friends";
import { type Friend } from "../types";

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  async function fetchFriends() {
    try {
      setLoading(true);
      setError(null);
      const data = await getFriends();
      setFriends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch friends");
    } finally {
      setLoading(false);
    }
  }

  async function deleteFriend(friendId: string) {
    try {
      await removeFriend(friendId);
      setFriends((prev) => prev.filter((f) => f.friend_id !== friendId));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to remove friend");
    }
  }

  async function createInvite(): Promise<string> {
    try {
      const code = await generateInvite();
      //   const inviteUrl = `${window.location.origin}/invite/${code}`;
      const inviteUrl = `${window.location.origin}${import.meta.env.BASE_URL}invite/${code}`;
      return inviteUrl;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to generate invite");
    }
  }

  return {
    friends,
    loading,
    error,
    refetch: fetchFriends,
    deleteFriend,
    createInvite,
  };
}
