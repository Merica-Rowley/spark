import { useEffect, useRef } from "react";
import { type PostWithMeta } from "../../types";
import Avatar from "../common/Avatar";
import AppImage from "../common/AppImage";

type Props = {
  post: PostWithMeta;
  onToggleReaction: (postId: string) => Promise<void>;
  onMarkViewed?: (postId: string) => void; // only needed in feed
  showDeleteButton?: boolean;
  onDelete?: (postId: string) => Promise<void>;
};

export default function PostCard({
  post,
  onToggleReaction,
  onMarkViewed,
  showDeleteButton = false,
  onDelete,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleReaction = async () => {
    await onToggleReaction(post.post_id);
  };

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

      {/* Reaction and timestamp */}
      <div>
        <button onClick={handleReaction}>
          🎉 {post.reaction_count > 0 ? post.reaction_count : ""}
          {post.user_reacted ? " (reacted)" : ""}
        </button>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        {showDeleteButton && onDelete && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  );
}
