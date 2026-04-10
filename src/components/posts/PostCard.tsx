import { useEffect, useRef, useState } from "react";
import { HiCheckCircle, HiUsers, HiTrash, HiUserMinus } from "react-icons/hi2";
import { type PostWithMeta } from "../../types";
import Avatar from "../common/Avatar";
import AppImage from "../common/AppImage";
import ManageParticipantsModal from "./ManageParticipantsModal";
import { removePostParticipant, getPostById } from "../../lib/posts";
import { useAuth } from "../../context/AuthContext";
import styles from "./PostCard.module.css";
import clsx from "clsx";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmModal from "../common/ConfirmModal";

type Props = {
  post: PostWithMeta;
  onToggleReaction: (postId: string) => Promise<void>;
  onMarkViewed?: (postId: string) => void;
  showDeleteButton?: boolean;
  onDelete?: (postId: string) => Promise<void>;
  onUpdated?: (updatedPost?: PostWithMeta) => void;
};

export default function PostCard({
  post,
  onToggleReaction,
  onMarkViewed,
  showDeleteButton = false,
  onDelete,
  onUpdated,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const { profile } = useAuth();
  const currentUserId = profile.id;
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    if (!onMarkViewed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onMarkViewed(post.post_id);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [post.post_id, onMarkViewed]);

  const handleDelete = async () => {
    if (!onDelete) return;
    const confirmed = await confirm({
      title: "Delete Post",
      message:
        "Are you sure you want to delete this post? This cannot be undone.",
      confirmLabel: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    await onDelete(post.post_id);
  };

  const handleRemoveSelf = async () => {
    try {
      await removePostParticipant(post.post_id, currentUserId);
      const updated = await getPostById(post.post_id);
      onUpdated?.(updated ?? undefined);
    } catch (err) {
      console.error("Failed to remove yourself from post:", err);
    }
  };

  const isAuthor = post.participants.some(
    (p) => p.user_id === currentUserId && p.is_author,
  );

  const isParticipant = post.participants.some(
    (p) => p.user_id === currentUserId && !p.is_author,
  );

  // format date
  const formattedDate = new Date(post.created_at).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <>
      <div ref={cardRef} className={styles.card}>
        {/* Header — participants + date */}
        <div className={styles.header}>
          <div className={styles.participants}>
            {post.participants.map((p, i) => (
              <div key={p.user_id} className={styles.participant}>
                <Avatar
                  avatarPath={p.avatar_url}
                  userId={p.user_id}
                  alt={p.username}
                  size={28}
                />
                <span
                  className={clsx(
                    styles.participantName,
                    p.is_author && styles.participantAuthor,
                  )}
                >
                  {p.username}
                </span>
                {i < post.participants.length - 1 && (
                  <span className={styles.participantSeparator}>and</span>
                )}
              </div>
            ))}
          </div>
          <span className={styles.date}>{formattedDate}</span>
        </div>

        {/* Image */}
        {post.image_url && (
          <AppImage
            imagePath={post.image_url}
            alt={post.list_item_content}
            className={styles.image}
          />
        )}

        {/* Completed item row */}
        <div className={styles.itemRow}>
          <HiCheckCircle size={18} className={styles.itemIcon} />
          <p className={styles.itemText}>
            {post.list_item_content}
            <span className={styles.listName}> · {post.list_title}</span>
          </p>
        </div>

        {/* Caption */}
        {post.content && <p className={styles.caption}>{post.content}</p>}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <button
              className={clsx(
                styles.reactionButton,
                post.user_reacted && styles.reactionButtonActive,
              )}
              onClick={() => onToggleReaction(post.post_id)}
            >
              🎉
              {post.reaction_count > 0 && (
                <span className={styles.reactionCount}>
                  {post.reaction_count}
                </span>
              )}
            </button>
          </div>

          <div className={styles.footerRight}>
            {isAuthor && (
              <button
                className={styles.actionButton}
                onClick={() => setShowParticipantsModal(true)}
              >
                <HiUsers size={14} />
                Participants
              </button>
            )}
            {isParticipant && (
              <button
                className={clsx(styles.actionButton, styles.actionButtonDanger)}
                onClick={handleRemoveSelf}
              >
                <HiUserMinus size={14} />
                Remove Me
              </button>
            )}
            {showDeleteButton && isAuthor && onDelete && (
              <button
                className={clsx(styles.actionButton, styles.actionButtonDanger)}
                onClick={handleDelete}
              >
                <HiTrash size={14} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {showParticipantsModal && (
        <ManageParticipantsModal
          postId={post.post_id}
          participants={post.participants}
          currentUserId={currentUserId}
          onClose={() => setShowParticipantsModal(false)}
          onUpdated={(updatedPost) => {
            setShowParticipantsModal(false);
            onUpdated?.(updatedPost);
          }}
        />
      )}

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
