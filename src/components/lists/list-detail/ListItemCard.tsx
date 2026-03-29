import { useState } from "react";
import { type ListItem } from "../../../types";

type Props = {
  item: ListItem;
  onDelete: (itemId: string) => Promise<void>;
  onItemCheck: (item: ListItem) => Promise<void>;
  onCompletedItemClick: (item: ListItem) => void;
};

export default function ListItemCard({
  item,
  onDelete,
  onItemCheck,
  onCompletedItemClick,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.is_completed) return;
    try {
      setLoading(true);
      await onItemCheck(item);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (item.is_completed) onCompletedItemClick(item);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this item?")) return;
    await onDelete(item.id);
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: item.is_completed ? "pointer" : "default" }}
    >
      <button onClick={handleCheck} disabled={loading || item.is_completed}>
        {item.is_completed ? "✅" : "⬜"}
      </button>
      <span
        style={{ textDecoration: item.is_completed ? "line-through" : "none" }}
      >
        {item.content}
      </span>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
