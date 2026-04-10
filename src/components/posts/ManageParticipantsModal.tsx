import { useState, useEffect } from "react";
import { HiXMark, HiStar, HiTrash, HiUserPlus } from "react-icons/hi2";
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
import ConfirmModal from "../common/ConfirmModal";
import { useConfirm } from "../../hooks/useConfirm";
import styles from "./ManageParticipantsModal.module.css";

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
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

  useEffect(() => {
    getListMembersForPost(postId).then(setEligibleMembers).catch(console.error);
  }, [postId]);

  const handleAdd = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await addPostParticipant(postId, userId);
      const updated = await getPostById(postId);
      onUpdated?.(updated ?? undefined);
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

  const handleRemove = async (userId: string, username: string) => {
    const isSelf = userId === currentUserId;
    const confirmed = await confirm({
      title: isSelf ? "Leave Post" : "Remove Participant",
      message: isSelf
        ? "Are you sure you want to remove yourself from this post?"
        : `Are you sure you want to remove ${username} from this post?`,
      confirmLabel: isSelf ? "Leave" : "Remove",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await removePostParticipant(postId, userId);
      const updated = await getPostById(postId);
      onUpdated?.(updated ?? undefined);
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
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>Manage Participants</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <HiXMark size={20} />
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {/* Current participants */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Current Participants</p>
              {participants.map((p) => (
                <div key={p.user_id} className={styles.participantRow}>
                  <div className={styles.participantInfo}>
                    <Avatar
                      avatarPath={p.avatar_url}
                      userId={p.user_id}
                      alt={p.username}
                      size={36}
                    />
                    <span className={styles.participantName}>{p.username}</span>
                  </div>
                  {p.is_author ? (
                    <span className={styles.authorBadge}>
                      <HiStar size={10} />
                      Author
                    </span>
                  ) : (
                    <button
                      className="btn-icon"
                      onClick={() => handleRemove(p.user_id, p.username)}
                      disabled={loading}
                      title="Remove participant"
                    >
                      <HiTrash size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add participants */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Add Participants</p>
              {eligibleMembers.length === 0 ? (
                <p className={styles.noMembers}>
                  No eligible list members to add.
                </p>
              ) : (
                eligibleMembers.map((member) => (
                  <div key={member.user_id} className={styles.memberRow}>
                    <div className={styles.memberInfo}>
                      <Avatar
                        avatarPath={member.avatar_url ?? null}
                        userId={member.user_id}
                        alt={member.username}
                        size={36}
                      />
                      <span className={styles.memberName}>
                        {member.username}
                      </span>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleAdd(member.user_id)}
                      disabled={loading}
                    >
                      <HiUserPlus size={14} />
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {options && (
        <ConfirmModal
          {...options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
