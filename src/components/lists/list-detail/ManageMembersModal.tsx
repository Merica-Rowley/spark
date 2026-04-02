import { useState, useEffect } from "react";
import { type ListMemberWithProfile, type Friend } from "../../../types";
import Avatar from "../../common/Avatar";
import MemberPicker from "../MemberPicker";

type Props = {
  listId: string;
  members: ListMemberWithProfile[];
  currentUserId: string;
  onClose: () => void;
  onAddMember: (userId: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  onTransferOwnership: (userId: string) => Promise<void>;
  getAvailableFriends: () => Promise<Friend[]>;
};

export default function ManageMembersModal({
  members,
  onClose,
  onAddMember,
  onRemoveMember,
  onTransferOwnership,
  getAvailableFriends,
}: Props) {
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmTransfer, setConfirmTransfer] = useState<string | null>(null);

  useEffect(() => {
    getAvailableFriends().then(setAvailableFriends).catch(console.error);
  }, []);

  const handleToggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.friend_id === friend.friend_id)
        ? prev.filter((f) => f.friend_id !== friend.friend_id)
        : [...prev, friend],
    );
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      await Promise.all(selectedFriends.map((f) => onAddMember(f.friend_id)));
      setSelectedFriends([]);
      // refresh available friends
      const updated = await getAvailableFriends();
      setAvailableFriends(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      setLoading(true);
      setError(null);
      await onRemoveMember(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferOwnership = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await onTransferOwnership(userId);
      setConfirmTransfer(null);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to transfer ownership",
      );
    } finally {
      setLoading(false);
    }
  };

  const collaborators = members.filter((m) => m.role === "member");

  return (
    <div>
      <div>
        <h2>Manage Members</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Current members */}
      <div>
        <h3>Current Members</h3>
        {collaborators.length === 0 ? (
          <p>No collaborators yet.</p>
        ) : (
          collaborators.map((member) => (
            <div key={member.user_id}>
              <Avatar
                avatarPath={member.avatar_url ?? null}
                userId={member.user_id}
                alt={member.username}
                size={32}
              />
              <span>{member.username}</span>
              <div>
                {confirmTransfer === member.user_id ? (
                  <>
                    <span>Transfer ownership to {member.username}?</span>
                    <button
                      onClick={() => handleTransferOwnership(member.user_id)}
                      disabled={loading}
                    >
                      Confirm
                    </button>
                    <button onClick={() => setConfirmTransfer(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmTransfer(member.user_id)}
                      disabled={loading}
                    >
                      Make Owner
                    </button>
                    <button
                      onClick={() => handleRemove(member.user_id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new members */}
      {availableFriends.length > 0 && (
        <div>
          <h3>Add Friends</h3>
          <MemberPicker
            availableFriends={availableFriends}
            selectedFriends={selectedFriends}
            onToggleFriend={handleToggleFriend}
          />
          <button
            onClick={handleAddMembers}
            disabled={loading || selectedFriends.length === 0}
          >
            {loading
              ? "Adding..."
              : `Add ${selectedFriends.length > 0 ? `(${selectedFriends.length})` : ""}`}
          </button>
        </div>
      )}

      {error && <p>{error}</p>}

      <button onClick={onClose} disabled={loading}>
        Done
      </button>
    </div>
  );
}
