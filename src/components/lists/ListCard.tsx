import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ListWithMeta } from "../../types";

type Props = {
  list: ListWithMeta;
  onDeleteList: (listId: string) => Promise<void>;
  onToggleStar: (listId: string, currentlyStarred: boolean) => Promise<void>;
};

export default function ListCard({ list, onDeleteList, onToggleStar }: Props) {
  const navigate = useNavigate();
  const [starring, setStarring] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigating to the list when clicking delete
    if (!confirm("Are you sure you want to delete this list?")) return;
    await onDeleteList(list.id);
  };

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setStarring(true);
      await onToggleStar(list.id, list.is_starred);
    } finally {
      setStarring(false);
    }
  };

  return (
    <div onClick={() => navigate(`/lists/${list.id}`)}>
      <button onClick={handleStar} disabled={starring}>
        {list.is_starred ? "⭐" : "☆"}
      </button>
      <span>{list.title}</span>
      <span>{list.role}</span>
      {list.role === "owner" && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
}
