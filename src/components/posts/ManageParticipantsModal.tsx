import { useState, useEffect } from "react";
import {
  type PostParticipant,
  type ListMemberWithProfile,
  type PostWithMeta,
} from "../../types";
import {
  addPostParticipant,
  removePostParticipant,
  getListMembersForPost,
  getPostById,
} from "../../lib/posts";
import Avatar from "../common/Avatar";

type Props = {
  postId: string;
  participants: PostParticipant[];
  currentUserId: string;
  onClose: () => void;
  onUpdated?: (updatedPost?: PostWithMeta) => void;
};

export default function ManageParticipantsModal({
  postId,
  participants,
  currentUserId,
  onClose,
  onUpdated,
}: Props) {
  const [eligibleMembers, setEligibleMembers] = useState<
    ListMemberWithProfile[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getListMembersForPost(postId).then(setEligibleMembers).catch(console.error);
  }, [postId]);

  const handleAdd = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await addPostParticipant(postId, userId);
      const updated = await getPostById(postId);
      onUpdated?.(updated ?? undefined); // add optional chaining
      const refreshed = await getListMembersForPost(postId);
      setEligibleMembers(refreshed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add participant",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    const isSelf = userId === currentUserId;
    if (
      !confirm(
        isSelf
          ? "Are you sure you want to remove yourself from this post?"
          : "Are you sure you want to remove this participant?",
      )
    )
      return;

    try {
      setLoading(true);
      setError(null);
      await removePostParticipant(postId, userId);
      const updated = await getPostById(postId);
      onUpdated?.(updated ?? undefined); // add optional chaining
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove participant",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Participants</h2>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Current participants */}
      <div>
        <h3>Current Participants</h3>
        {participants.map((p) => (
          <div key={p.user_id}>
            <Avatar
              avatarPath={p.avatar_url}
              userId={p.user_id}
              alt={p.username}
              size={32}
            />
            <span>{p.username}</span>
            {p.is_author && <span>(author)</span>}
            {!p.is_author && (
              <button
                onClick={() => handleRemove(p.user_id)}
                disabled={loading}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add participants */}
      <div>
        <h3>Add Participants</h3>
        {eligibleMembers.length === 0 ? (
          <p>No eligible list members to add.</p>
        ) : (
          eligibleMembers.map((member) => (
            <div key={member.user_id}>
              <Avatar
                avatarPath={member.avatar_url ?? null}
                userId={member.user_id}
                alt={member.username}
                size={32}
              />
              <span>{member.username}</span>
              <button
                onClick={() => handleAdd(member.user_id)}
                disabled={loading}
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>

      {error && <p>{error}</p>}

      <button onClick={onClose} disabled={loading}>
        Done
      </button>
    </div>
  );
}
