import { useState, useEffect } from "react";
import {
  HiXMark,
  HiMiniRocketLaunch,
  HiTrash,
  HiCheck,
  HiUserPlus,
} from "react-icons/hi2";
import { type ListMemberWithProfile, type Friend } from "../../../types";
import Avatar from "../../common/Avatar";
import ConfirmModal from "../../common/ConfirmModal";
import { useConfirm } from "../../../hooks/useConfirm";
import styles from "./ManageMembersModal.module.css";
import clsx from "clsx";

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
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

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

  const isSelected = (friend: Friend) =>
    selectedFriends.some((f) => f.friend_id === friend.friend_id);

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      await Promise.all(selectedFriends.map((f) => onAddMember(f.friend_id)));
      setSelectedFriends([]);
      const updated = await getAvailableFriends();
      setAvailableFriends(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string, username: string) => {
    const confirmed = await confirm({
      title: "Remove Member",
      message: `Are you sure you want to remove ${username} from this list?`,
      confirmLabel: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
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
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>Manage Members</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <HiXMark size={20} />
            </button>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {/* Current members */}
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Current Members</p>

              {/* Owner row */}
              {members
                .filter((m) => m.role === "owner")
                .map((m) => (
                  <div key={m.user_id} className={styles.memberRow}>
                    <div className={styles.memberInfo}>
                      <Avatar
                        avatarPath={m.avatar_url ?? null}
                        userId={m.user_id}
                        alt={m.username}
                        size={36}
                      />
                      <span className={styles.memberName}>{m.username}</span>
                    </div>
                    <div className={styles.ownerBadge}>
                      <HiMiniRocketLaunch size={10} />
                      Owner
                    </div>
                  </div>
                ))}

              {/* Collaborator rows */}
              {collaborators.length === 0 ? (
                <p className={styles.noFriends}>No collaborators yet.</p>
              ) : (
                collaborators.map((m) => (
                  <div key={m.user_id} className={styles.memberRow}>
                    <div className={styles.memberInfo}>
                      <Avatar
                        avatarPath={m.avatar_url ?? null}
                        userId={m.user_id}
                        alt={m.username}
                        size={36}
                      />
                      <span className={styles.memberName}>{m.username}</span>
                    </div>
                    <div className={styles.memberActions}>
                      {confirmTransfer === m.user_id ? (
                        <div className={styles.transferConfirm}>
                          <span className={styles.transferLabel}>
                            Make owner?
                          </span>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleTransferOwnership(m.user_id)}
                            disabled={loading}
                          >
                            <HiCheck size={14} />
                            Yes
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setConfirmTransfer(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setConfirmTransfer(m.user_id)}
                            disabled={loading}
                            title="Transfer ownership"
                          >
                            <HiMiniRocketLaunch size={14} />
                            Make Owner
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleRemove(m.user_id, m.username)}
                            disabled={loading}
                            title="Remove member"
                          >
                            <HiTrash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add members */}
            {availableFriends.length > 0 && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Add Friends</p>
                <div className={styles.addMemberList}>
                  {availableFriends.map((friend) => (
                    <button
                      key={friend.friend_id}
                      className={clsx(
                        styles.addMemberOption,
                        isSelected(friend) && styles.addMemberOptionSelected,
                      )}
                      onClick={() => handleToggleFriend(friend)}
                      disabled={loading}
                    >
                      <Avatar
                        avatarPath={friend.avatar_url}
                        userId={friend.friend_id}
                        alt={friend.username}
                        size={32}
                      />
                      <span className={styles.addMemberName}>
                        {friend.username}
                      </span>
                      <div
                        className={clsx(
                          styles.checkbox,
                          isSelected(friend) && styles.checkboxChecked,
                        )}
                      >
                        {isSelected(friend) && <HiCheck size={12} />}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedFriends.length > 0 && (
                  <button
                    className={clsx("btn btn-secondary", styles.addButton)}
                    onClick={handleAddMembers}
                    disabled={loading}
                  >
                    <HiUserPlus size={16} />
                    Add {selectedFriends.length} Member
                    {selectedFriends.length > 1 ? "s" : ""}
                  </button>
                )}
              </div>
            )}

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
