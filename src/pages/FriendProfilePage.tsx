import { useParams, useNavigate } from "react-router-dom";
import { useFriendProfile } from "../hooks/useFriendProfile";
import Avatar from "../components/common/Avatar";

export default function FriendProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, loading, error } = useFriendProfile(id!);

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

      {/* Posts will go here in a future phase */}
    </div>
  );
}
