import { useState, useEffect } from "react";
import {
  type ListItem,
  type ListMemberWithProfile,
  type PostWithMeta,
} from "../../../types";
import { getPostById, toggleReaction } from "../../../lib/posts";
import PostCard from "../../posts/PostCard";

type Props = {
  item: ListItem;
  listMembers: ListMemberWithProfile[];
  currentUserId: string;
  onClose: () => void;
  onUncomplete: () => Promise<void>;
  onCreatePost: () => void;
  onDeletePost: (postId: string) => Promise<void>;
};

export default function CompletedItemModal({
  item,
  onClose,
  onUncomplete,
  onCreatePost,
  onDeletePost,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<PostWithMeta | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  const hasPost = !!item.post_id;

  useEffect(() => {
    if (!item.post_id) return;
    setPostLoading(true);
    getPostById(item.post_id)
      .then(setPost)
      .catch(console.error)
      .finally(() => setPostLoading(false));
  }, [item.post_id]);

  const handleToggleReaction = async (postId: string) => {
    try {
      const result = await toggleReaction(postId);
      setPost((prev) =>
        prev
          ? {
              ...prev,
              user_reacted: result.user_reacted,
              reaction_count: result.reaction_count,
            }
          : prev,
      );
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    }
  };

  const handleUncomplete = async () => {
    if (hasPost) {
      if (
        !confirm(
          "To uncheck this item, the associated post must be deleted first. Delete the post and uncheck this item?",
        )
      )
        return;
      try {
        setLoading(true);
        await onDeletePost(item.post_id!);
        await onUncomplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to uncheck item");
      } finally {
        setLoading(false);
      }
    } else {
      if (!confirm("Are you sure you want to uncheck this item?")) return;
      try {
        setLoading(true);
        await onUncomplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to uncheck item");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePost = async () => {
    if (!item.post_id) return;
    try {
      setLoading(true);
      await onDeletePost(item.post_id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>{item.content}</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <p>✅ Completed!</p>

      {hasPost ? (
        <div>
          {postLoading ? (
            <p>Loading post...</p>
          ) : post ? (
            <PostCard
              post={post}
              onToggleReaction={handleToggleReaction}
              showDeleteButton={true}
              onDelete={handleDeletePost}
              onUpdated={() => {
                if (item.post_id) {
                  getPostById(item.post_id).then(setPost).catch(console.error);
                }
              }}
            />
          ) : (
            <p>Could not load post.</p>
          )}
        </div>
      ) : (
        <div>
          <p>No post created yet.</p>
          <button onClick={onCreatePost} disabled={loading}>
            Create Post
          </button>
        </div>
      )}

      {error && <p>{error}</p>}

      <div>
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleUncomplete} disabled={loading}>
          {loading ? "Unchecking..." : "Uncheck Item"}
        </button>
      </div>
    </div>
  );
}
