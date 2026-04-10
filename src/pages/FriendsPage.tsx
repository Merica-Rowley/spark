import { useState } from "react";
import { HiUserPlus, HiUserGroup } from "react-icons/hi2";
import { useFriends } from "../hooks/useFriends";
import FriendsList from "../components/friends/FriendsList";
import InviteModal from "../components/friends/InviteModal";
import styles from "./FriendsPage.module.css";

export default function FriendsPage() {
  const { friends, loading, error, deleteFriend, createInvite } = useFriends();
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Friends</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowInviteModal(true)}
        >
          <HiUserPlus size={18} />
          Invite Friend
        </button>
      </div>

      {/* Friends list or empty state */}
      {friends.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <HiUserGroup size={32} />
          </div>
          <p className={styles.emptyTitle}>No friends yet</p>
          <p className={styles.emptyText}>
            Invite your friends to Spark and start sharing your bucket list
            adventures together!
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowInviteModal(true)}
          >
            <HiUserPlus size={18} />
            Invite Your First Friend
          </button>
        </div>
      ) : (
        <div className={styles.friendsList}>
          <FriendsList friends={friends} onRemoveFriend={deleteFriend} />
        </div>
      )}

      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onGenerateInvite={createInvite}
        />
      )}
    </div>
  );
}
