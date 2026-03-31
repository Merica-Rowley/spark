import { useState } from "react";
import {
  type List,
  type ListMemberWithProfile,
  type ListRole,
} from "../../../types";

type Props = {
  list: List;
  members: ListMemberWithProfile[];
  role: ListRole;
  isStarred: boolean;
  onToggleStar: () => Promise<void>;
};

export default function ListHeader({
  list,
  members,
  role,
  isStarred,
  onToggleStar,
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
      <div>
        <h1>{list.title}</h1>
        <button onClick={handleStar} disabled={starring}>
          {isStarred ? "⭐" : "☆"}
        </button>
      </div>
      <p>
        {members.map((m, i) => (
          <span key={m.user_id}>
            {m.username}
            {m.role === "owner" ? " (owner)" : ""}
            {i < members.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <p>Your role: {role}</p>
    </div>
  );
}
