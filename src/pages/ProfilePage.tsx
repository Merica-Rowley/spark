import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import Avatar from "../components/common/Avatar";
import EditProfileModal from "../components/profile/EditProfileModal";

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div>
      <button onClick={() => navigate("/lists")}>← Back</button>
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
