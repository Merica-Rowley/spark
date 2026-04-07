import { useState } from "react";
import {
  type List,
  type ListMemberWithProfile,
  type ListRole,
} from "../../../types";
import AppImage from "../../common/AppImage";
import Avatar from "../../common/Avatar";

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
    <div>
      <AppImage imagePath={list.image_url} alt={list.title} />
      <div>
        <h1>{list.title}</h1>
        <button onClick={handleStar} disabled={starring}>
          {isStarred ? "⭐" : "☆"}
        </button>
        {role === "owner" && (
          <>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onManageMembers}>Manage Members</button>
          </>
        )}
        {role === "member" && (
          <>
            <button onClick={onLeaveList}>Leave List</button>
          </>
        )}
      </div>
      <div>
        {members.map((m, i) => (
          <span key={m.user_id}>
            <Avatar
              avatarPath={m.avatar_url ?? null}
              userId={m.user_id}
              alt={m.username}
              size={32}
            />
            {m.username}
            {m.role === "owner" ? " (owner)" : ""}
            {i < members.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
      <p>Your role: {role}</p>
    </div>
  );
}
