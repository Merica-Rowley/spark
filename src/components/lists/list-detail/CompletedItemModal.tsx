import { useState } from "react";
import { type ListItem, type ListMemberWithProfile } from "../../../types";

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

  const hasPost = !!item.post_id;

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
    if (!confirm("Are you sure you want to delete this post?")) return;
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
          <p>A post exists for this item.</p>
          {/* Full post display will be added when PostCard is built */}
          <button onClick={handleDeletePost} disabled={loading}>
            Delete Post
          </button>
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
