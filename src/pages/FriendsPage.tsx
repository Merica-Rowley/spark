import { useState } from "react";
import { useFriends } from "../hooks/useFriends";
import FriendsList from "../components/friends/FriendsList";
import InviteModal from "../components/friends/InviteModal";

export default function FriendsPage() {
  const { friends, loading, error, deleteFriend, createInvite } = useFriends();
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
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
