import { useNavigate } from "react-router-dom";
import { HiUserMinus } from "react-icons/hi2";
import { type Friend } from "../../types";
import Avatar from "../common/Avatar";
import ConfirmModal from "../common/ConfirmModal";
import { useConfirm } from "../../hooks/useConfirm";
import styles from "./FriendCard.module.css";

type Props = {
  friend: Friend;
  onRemove: (friendId: string) => Promise<void>;
};

export default function FriendCard({ friend, onRemove }: Props) {
  const navigate = useNavigate();
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = await confirm({
      title: "Remove Friend",
      message: `Are you sure you want to remove ${friend.username} as a friend? You will need a new invite to reconnect.`,
      confirmLabel: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
    await onRemove(friend.friend_id);
  };

  const friendSince = new Date(friend.created_at).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" },
  );

  return (
    <>
      <div
        className={styles.card}
        onClick={() => navigate(`/friends/${friend.friend_id}`)}
      >
        <div className={styles.avatarWrapper}>
          <Avatar
            avatarPath={friend.avatar_url}
            userId={friend.friend_id}
            alt={friend.username}
            size={44}
          />
        </div>

        <div className={styles.info}>
          <p className={styles.username}>{friend.username}</p>
          <p className={styles.friendSince}>Friends since {friendSince}</p>
        </div>

        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.removeButton}
            onClick={handleRemove}
            title="Remove friend"
          >
            <HiUserMinus size={18} />
          </button>
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
