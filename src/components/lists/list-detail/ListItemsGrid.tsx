import { useState } from "react";
import { type ListItem, type ListRole } from "../../../types";
import ListItemCard from "./ListItemCard";

type Props = {
  items: ListItem[];
  role: ListRole;
  onAddItem: (content: string) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onItemCheck: (item: ListItem) => Promise<void>;
  onCompletedItemClick: (item: ListItem) => void;
};

export default function ListItemsGrid({
  items,
  onAddItem,
  onDeleteItem,
  onItemCheck,
  onCompletedItemClick,
}: Props) {
  const [newItemContent, setNewItemContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newItemContent.trim()) return;
    try {
      setAdding(true);
      setError(null);
      await onAddItem(newItemContent.trim());
      setNewItemContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div>
      {items.length === 0 ? (
        <p>No items yet. Add one below!</p>
      ) : (
        items.map((item) => (
          <ListItemCard
            key={item.id}
            item={item}
            onDelete={onDeleteItem}
            onItemCheck={onItemCheck}
            onCompletedItemClick={onCompletedItemClick}
          />
        ))
      )}

      <div>
        <input
          type="text"
          placeholder="Add a new item..."
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={adding}
        />
        <button onClick={handleAdd} disabled={adding || !newItemContent.trim()}>
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p>{error}</p>}
    </div>
  );
}
