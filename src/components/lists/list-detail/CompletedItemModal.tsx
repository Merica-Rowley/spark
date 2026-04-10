import { useState, useEffect } from "react";
import { HiXMark, HiCheckCircle, HiPhoto } from "react-icons/hi2";
import {
  type ListItem,
  type ListMemberWithProfile,
  type PostWithMeta,
} from "../../../types";
import { getPostById, toggleReaction } from "../../../lib/posts";
import PostCard from "../../posts/PostCard";
import ConfirmModal from "../../common/ConfirmModal";
import { useConfirm } from "../../../hooks/useConfirm";
import styles from "./CompletedItemModal.module.css";

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
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

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
    const confirmed = await confirm({
      title: hasPost ? "Delete Post & Uncheck Item" : "Uncheck Item",
      message: hasPost
        ? "This will delete the associated post and uncheck the item. This cannot be undone."
        : "Are you sure you want to uncheck this item?",
      confirmLabel: hasPost ? "Delete & Uncheck" : "Uncheck",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      setLoading(true);
      if (hasPost) await onDeletePost(item.post_id!);
      await onUncomplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to uncheck item");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setLoading(true);
      await onDeletePost(postId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerText}>
              <h2 className={styles.title}>✅ Completed Item</h2>
              <span className={styles.itemBadge}>
                <HiCheckCircle size={12} />
                {item.content}
              </span>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <HiXMark size={20} />
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {hasPost ? (
              <>
                {postLoading ? (
                  <div className={styles.postLoading}>
                    <div className="spinner" />
                  </div>
                ) : post ? (
                  <div className={styles.postWrapper}>
                    <PostCard
                      post={post}
                      onToggleReaction={handleToggleReaction}
                      showDeleteButton={true}
                      onDelete={handleDeletePost}
                      onUpdated={() => {
                        if (item.post_id) {
                          getPostById(item.post_id)
                            .then(setPost)
                            .catch(console.error);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <p className={styles.error}>Could not load post.</p>
                )}
              </>
            ) : (
              <div className={styles.noPost}>
                <HiPhoto size={40} className={styles.noPostIcon} />
                <p className={styles.noPostText}>
                  No post created for this item yet.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={onCreatePost}
                  disabled={loading}
                >
                  Create Post
                </button>
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleUncomplete}
              disabled={loading}
            >
              {loading ? "Unchecking..." : "Uncheck Item"}
            </button>
          </div>
        </div>
      </div>

      {options && (
        <ConfirmModal
          {...options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
