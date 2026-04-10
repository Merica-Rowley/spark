import { useState } from "react";
import {
  HiStar,
  HiOutlineStar,
  HiPencil,
  HiUserPlus,
  HiArrowRightOnRectangle,
  HiMiniRocketLaunch,
} from "react-icons/hi2";
import {
  type List,
  type ListMemberWithProfile,
  type ListRole,
} from "../../../types";
import Avatar from "../../common/Avatar";
import AppImage from "../../common/AppImage";
import styles from "./ListHeader.module.css";
import clsx from "clsx";

type Props = {
  list: List;
  members: ListMemberWithProfile[];
  role: ListRole;
  isStarred: boolean;
  onToggleStar: () => Promise<void>;
  onEdit: () => void;
  onManageMembers: () => void;
  onLeaveList: () => void;
};

export default function ListHeader({
  list,
  members,
  role,
  isStarred,
  onToggleStar,
  onEdit,
  onManageMembers,
  onLeaveList,
}: Props) {
  const [starring, setStarring] = useState(false);

  const handleStar = async () => {
    try {
      setStarring(true);
      await onToggleStar();
    } finally {
      setStarring(false);
    }
  };

  return (
    <div className={styles.header}>
      {/* Banner image */}
      <AppImage
        imagePath={list.image_url}
        alt={list.title}
        className={styles.banner}
      />

      {/* Title row */}
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{list.title}</h1>
        <div className={styles.actions}>
          <button
            className={clsx(
              styles.starButton,
              isStarred && styles.starButtonActive,
            )}
            onClick={handleStar}
            disabled={starring}
            title={isStarred ? "Unstar" : "Star"}
          >
            {isStarred ? <HiStar size={20} /> : <HiOutlineStar size={20} />}
          </button>
          {role === "owner" && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onEdit}
                title="Edit list"
              >
                <HiPencil size={16} />
                Edit
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onManageMembers}
                title="Manage members"
              >
                <HiUserPlus size={16} />
                Members
              </button>
            </>
          )}
          {role === "member" && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onLeaveList}
                title="Leave list"
              >
                <HiArrowRightOnRectangle size={16} />
                Leave
              </button>
            </>
          )}
        </div>
      </div>

      {/* Members */}
      <div className={styles.membersRow}>
        {members.map((m) => (
          <div key={m.user_id} className={styles.memberChip}>
            <Avatar
              avatarPath={m.avatar_url ?? null}
              userId={m.user_id}
              alt={m.username}
              size={20}
            />
            {m.username}
            {m.role === "owner" && (
              <HiMiniRocketLaunch size={12} className={styles.ownerIcon} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
