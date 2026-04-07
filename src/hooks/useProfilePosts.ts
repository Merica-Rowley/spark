import { useState, useEffect } from "react";
import { getProfilePosts, toggleReaction } from "../lib/posts";
import { type PostWithMeta } from "../types";

export function useProfilePosts(userId: string) {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return; // don't fetch if no userId yet
    fetchPosts();
  }, [userId]);

  async function fetchPosts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfilePosts(userId);
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleReaction(postId: string) {
    try {
      const result = await toggleReaction(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                user_reacted: result.user_reacted,
                reaction_count: result.reaction_count,
              }
            : p,
        ),
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to toggle reaction");
    }
  }

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    toggleReaction: handleToggleReaction,
  };
}
