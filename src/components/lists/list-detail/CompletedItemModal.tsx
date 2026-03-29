import { useState } from "react";
import { type ListItem } from "../../../types";

type Props = {
  item: ListItem;
  onClose: () => void;
  onUncomplete: () => Promise<void>;
  onCreatePost: () => void;
};

export default function CompletedItemModal({
  item,
  onClose,
  onUncomplete,
  onCreatePost,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleUncomplete = async () => {
    if (!confirm("Are you sure you want to uncheck this item?")) return;
    try {
      setLoading(true);
      await onUncomplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>{item.content}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <p>This item has been completed! ✅</p>
      <div>
        {/* Post display will go here in a future phase */}
        <p>No post created yet.</p>
        <button onClick={onCreatePost}>Create Post</button>
      </div>
      <div>
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleUncomplete} disabled={loading}>
          {loading ? "Unchecking..." : "Uncheck Item"}
        </button>
      </div>
    </div>
  );
}
