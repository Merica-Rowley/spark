import { useState } from "react";
import { HiPencil, HiPhoto } from "react-icons/hi2";
import { useProfile } from "../hooks/useProfile";
import { useProfilePosts } from "../hooks/useProfilePosts";
import { deletePost } from "../lib/posts";
import Avatar from "../components/common/Avatar";
import PostCard from "../components/posts/PostCard";
import EditProfileModal from "../components/profile/EditProfileModal";
import styles from "./ProfilePage.module.css";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { loading, error, updateProfile } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);

  const { profile } = useAuth();

  const {
    posts,
    loading: postsLoading,
    toggleReaction,
    refetch: refetchPosts,
  } = useProfilePosts(profile?.id ?? "");

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
          <p>Error: {error ?? "Profile not found"}</p>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
    refetchPosts();
  };

  return (
    <div className={styles.page}>
      {/* Profile header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarWrapper}>
          <Avatar
            avatarPath={profile.avatar_url}
            userId={profile.id}
            alt={profile.username}
            size={80}
          />
        </div>

        <div className={styles.profileInfo}>
          <h1 className={styles.username}>{profile.username}</h1>
          <p className={styles.joinDate}>Member since {joinDate}</p>
        </div>

        <div className={styles.editButton}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowEditModal(true)}
          >
            <HiPencil size={16} />
            Edit Profile
          </button>
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
              No posts yet. Complete a bucket list item to create your first
              post!
            </p>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                onToggleReaction={toggleReaction}
                showDeleteButton={true}
                onDelete={handleDeletePost}
                onUpdated={refetchPosts}
              />
            ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={async (username, imageFile, removeAvatar) => {
            await updateProfile(username, imageFile, removeAvatar);
            await refetchPosts(); // refetch posts to get updated avatar
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
