import { useParams, useNavigate } from "react-router-dom";
import { HiChevronLeft, HiPhoto } from "react-icons/hi2";
import { useFriendProfile } from "../hooks/useFriendProfile";
import { useProfilePosts } from "../hooks/useProfilePosts";
import Avatar from "../components/common/Avatar";
import PostCard from "../components/posts/PostCard";
import styles from "./FriendProfilePage.module.css";

export default function FriendProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading, error } = useFriendProfile(id!);
  const {
    posts,
    loading: postsLoading,
    toggleReaction,
    refetch: refetchPosts,
  } = useProfilePosts(id!);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error ?? "Profile not found"}</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.page}>
      {/* Back button */}
      <div className={styles.backButton}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() =>
            window.history.length > 1 ? navigate(-1) : navigate("/friends")
          }
        >
          <HiChevronLeft size={18} />
          Back
        </button>
      </div>

      {/* Profile header */}
      <div className={styles.profileHeader}>
        <Avatar
          avatarPath={profile.avatar_url}
          userId={profile.id}
          alt={profile.username}
          size={80}
        />
        <div className={styles.profileInfo}>
          <h1 className={styles.username}>{profile.username}</h1>
          <p className={styles.joinDate}>Member since {joinDate}</p>
        </div>
      </div>

      {/* Posts section */}
      <div className={styles.postsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Posts</h2>
          {!postsLoading && (
            <span className={styles.postCount}>{posts.length}</span>
          )}
        </div>

        {postsLoading ? (
          <div className={styles.loading}>
            <div className="spinner" />
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyPosts}>
            <HiPhoto size={40} className={styles.emptyPostsIcon} />
            <p className={styles.emptyPostsText}>
              {profile.username} hasn't created any posts yet.
            </p>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                onToggleReaction={toggleReaction}
                onUpdated={refetchPosts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
