import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import Avatar from "../components/common/Avatar";
import EditProfileModal from "../components/profile/EditProfileModal";
import { useProfilePosts } from "../hooks/useProfilePosts";
import PostCard from "../components/posts/PostCard";
import { deletePost } from "../lib/posts";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { loading, error, updateProfile } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);

  // with this:
  const { profile } = useAuth();
  const userId = profile.id;

  const {
    posts,
    loading: postsLoading,
    toggleReaction,
    refetch: refetchPosts,
  } = useProfilePosts(userId ?? "");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
    refetchPosts();
  };

  return (
    <div>
      <h1>Profile</h1>

      <Avatar
        avatarPath={profile.avatar_url}
        userId={profile.id}
        alt={profile.username}
        size={80}
      />

      <p>{profile.username}</p>
      <p>Member since {new Date(profile.created_at).toLocaleDateString()}</p>

      <button onClick={() => setShowEditModal(true)}>Edit</button>

      <div>
        <h2>Posts</h2>
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.post_id}
              post={post}
              onToggleReaction={toggleReaction}
              showDeleteButton={true}
              onDelete={handleDeletePost}
              onUpdated={refetchPosts}
            />
          ))
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSaved={async (username, imageFile, removeAvatar) => {
            await updateProfile(username, imageFile, removeAvatar);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
