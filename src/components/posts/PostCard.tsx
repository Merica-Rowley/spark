import { useEffect, useRef, useState } from "react";
import { type PostWithMeta } from "../../types";
import Avatar from "../common/Avatar";
import AppImage from "../common/AppImage";
import ManageParticipantsModal from "./ManageParticipantsModal";
import { getPostById, removePostParticipant } from "../../lib/posts";
import { useAuth } from "../../context/AuthContext";

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

  // with this:
  const { profile } = useAuth();
  const currentUserId = profile.id;

  // intersection observer for marking posts as viewed
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
      { threshold: 0.5 }, // post must be 50% visible to count as viewed
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [post.post_id, onMarkViewed]);

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this post?")) return;
    await onDelete(post.post_id);
  };

  const isAuthor = post.participants.some(
    (p) => p.user_id === currentUserId && p.is_author,
  );

  const isParticipant = post.participants.some(
    (p) => p.user_id === currentUserId && !p.is_author,
  );

  return (
    <div ref={cardRef}>
      {/* Participants */}
      <div>
        {post.participants.map((p, i) => (
          <span key={p.user_id}>
            <Avatar
              avatarPath={p.avatar_url}
              userId={p.user_id}
              alt={p.username}
              size={32}
            />
            <span>{p.username}</span>
            {i < post.participants.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>

      {/* List item and list name */}
      <p>
        ✅ {post.list_item_content}
        <span> · {post.list_title}</span>
      </p>

      {/* Post image */}
      {post.image_url && (
        <AppImage imagePath={post.image_url} alt={post.list_item_content} />
      )}

      {/* Caption */}
      {post.content && <p>{post.content}</p>}

      {/* Reaction, timestamp, participant management */}
      <div>
        <button onClick={() => onToggleReaction(post.post_id)}>
          🎉 {post.reaction_count > 0 ? post.reaction_count : ""}
          {post.user_reacted ? " (reacted)" : ""}
        </button>

        <span>{new Date(post.created_at).toLocaleDateString()}</span>

        {isAuthor && (
          <button onClick={() => setShowParticipantsModal(true)}>
            Manage Participants
          </button>
        )}

        {isParticipant && (
          <button
            onClick={async () => {
              if (!currentUserId) return;
              if (
                !confirm(
                  "Are you sure you want to remove yourself from this post?",
                )
              )
                return;
              try {
                await removePostParticipant(post.post_id, currentUserId);
                const updated = await getPostById(post.post_id);
                onUpdated?.(updated ?? undefined);
              } catch (err) {
                alert(
                  err instanceof Error
                    ? err.message
                    : "Failed to remove yourself from post",
                );
              }
            }}
          >
            Remove Me
          </button>
        )}

        {showDeleteButton && isAuthor && onDelete && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>

      {showParticipantsModal && currentUserId && (
        <ManageParticipantsModal
          postId={post.post_id}
          participants={post.participants}
          currentUserId={currentUserId}
          onClose={() => setShowParticipantsModal(false)}
          onUpdated={() => {
            setShowParticipantsModal(false);
            onUpdated?.();
          }}
        />
      )}
    </div>
  );
}
