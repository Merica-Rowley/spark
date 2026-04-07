import { useParams, useNavigate } from "react-router-dom";
import { useFriendProfile } from "../hooks/useFriendProfile";
import Avatar from "../components/common/Avatar";
import { useProfilePosts } from "../hooks/useProfilePosts";
import PostCard from "../components/posts/PostCard";

export default function FriendProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading, error } = useFriendProfile(id!);
  const { posts, loading: postsLoading, toggleReaction } = useProfilePosts(id!);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <button
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/friends")
        }
      >
        ← Back
      </button>

      <Avatar
        avatarPath={profile.avatar_url}
        userId={profile.id}
        alt={profile.username}
        size={80}
      />

      <p>{profile.username}</p>
      <p>Member since {new Date(profile.created_at).toLocaleDateString()}</p>

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
            />
          ))
        )}
      </div>
    </div>
  );
}
