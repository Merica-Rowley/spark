import { useState, useEffect } from "react";
import { getFeed, markPostViewed, toggleReaction } from "../lib/posts";
import { type PostWithMeta } from "../types";

export function useFeed() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeed();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkViewed(postId: string) {
    try {
      await markPostViewed(postId);
    } catch (err) {
      console.error("Failed to mark post as viewed:", err);
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
    refetch: fetchFeed,
    markViewed: handleMarkViewed,
    toggleReaction: handleToggleReaction,
  };
}
