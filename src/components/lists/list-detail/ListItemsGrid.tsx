import { useState } from "react";
import { HiPlus, HiClipboardDocumentList } from "react-icons/hi2";
import { type ListItem, type ListRole } from "../../../types";
import ListItemCard from "./ListItemCard";
import styles from "./ListItemsGrid.module.css";

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

  const incompleteItems = items.filter((i) => !i.is_completed);
  const completedItems = items.filter((i) => i.is_completed);

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
    <div className={styles.container}>
      {/* Add item */}
      <div className={styles.addRow}>
        <HiPlus size={18} className={styles.addIcon} />
        <input
          className={styles.addInput}
          type="text"
          placeholder="Add a new item..."
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={adding}
        />
        <button
          className={styles.addButton}
          onClick={handleAdd}
          disabled={adding || !newItemContent.trim()}
        >
          <HiPlus size={16} />
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* Incomplete items */}
      {incompleteItems.length === 0 && completedItems.length === 0 ? (
        <div className={styles.emptyState}>
          <HiClipboardDocumentList size={40} className={styles.emptyIcon} />
          <p>No items yet — add your first one below!</p>
        </div>
      ) : (
        <>
          {incompleteItems.length > 0 && (
            <>
              <p className={styles.sectionLabel}>To Do</p>
              {incompleteItems.map((item) => (
                <ListItemCard
                  key={item.id}
                  item={item}
                  onDelete={onDeleteItem}
                  onItemCheck={onItemCheck}
                  onCompletedItemClick={onCompletedItemClick}
                />
              ))}
            </>
          )}

          {/* Completed items */}
          {completedItems.length > 0 && (
            <>
              <div className={styles.divider} />
              <p className={styles.sectionLabel}>
                Completed ({completedItems.length})
              </p>
              {completedItems.map((item) => (
                <ListItemCard
                  key={item.id}
                  item={item}
                  onDelete={onDeleteItem}
                  onItemCheck={onItemCheck}
                  onCompletedItemClick={onCompletedItemClick}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}
