import { useNavigate } from "react-router-dom";
import { useFeed } from "../hooks/useFeed";
import PostCard from "../components/posts/PostCard";

export default function FeedPage() {
  const { posts, loading, error, markViewed, toggleReaction } = useFeed();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <button onClick={() => navigate("/lists")}>← Back</button>
        <h1>Feed</h1>
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          post={post}
          onToggleReaction={toggleReaction}
          onMarkViewed={markViewed}
        />
      ))}

      <div>
        <p>🎉 You're all caught up!</p>
        <p>Check back later for new posts from your friends.</p>
      </div>
    </div>
  );
}
