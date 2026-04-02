import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriends } from "../hooks/useFriends";
import FriendsList from "../components/friends/FriendsList";
import InviteModal from "../components/friends/InviteModal";

export default function FriendsPage() {
  const { friends, loading, error, deleteFriend, createInvite } = useFriends();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <button onClick={() => navigate("/lists")}>← Back</button>
        <h1>Friends</h1>
        <button onClick={() => setShowInviteModal(true)}>
          + Invite Friend
        </button>
      </div>

      <FriendsList friends={friends} onRemoveFriend={deleteFriend} />

      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onGenerateInvite={createInvite}
        />
      )}
    </div>
  );
}
