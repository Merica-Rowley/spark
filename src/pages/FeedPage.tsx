import { HiArrowPath } from "react-icons/hi2";
import { useFeed } from "../hooks/useFeed";
import PostCard from "../components/posts/PostCard";
import styles from "./FeedPage.module.css";

export default function FeedPage() {
  const {
    posts,
    setPosts,
    loading,
    error,
    refetch,
    markViewed,
    toggleReaction,
  } = useFeed();

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
          <button className="btn btn-ghost" onClick={refetch}>
            <HiArrowPath size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Feed</h1>
        <button className="btn btn-ghost btn-sm" onClick={refetch}>
          <HiArrowPath size={16} />
          Refresh
        </button>
      </div>

      <div className={styles.postList}>
        {posts.map((post) => (
          <PostCard
            key={post.post_id}
            post={post}
            onToggleReaction={toggleReaction}
            onMarkViewed={markViewed}
            onUpdated={(updatedPost) => {
              if (updatedPost) {
                setPosts((prev) =>
                  prev.map((p) =>
                    p.post_id === updatedPost.post_id ? updatedPost : p,
                  ),
                );
              }
            }}
          />
        ))}

        {/* Always shown at bottom */}
        <div className={styles.caughtUp}>
          <span className={styles.caughtUpIcon}>🎉</span>
          <p className={styles.caughtUpTitle}>You're all caught up!</p>
          <p className={styles.caughtUpText}>
            Check back later for new posts from your friends.
          </p>
        </div>
      </div>
    </div>
  );
}
