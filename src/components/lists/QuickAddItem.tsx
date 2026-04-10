import { useState, useRef, useEffect } from "react";
import { HiPlus, HiChevronDown } from "react-icons/hi2";
import { type ListWithMeta } from "../../types";
import { addItem } from "../../lib/lists";
import styles from "./QuickAddItem.module.css";
import clsx from "clsx";

type Props = {
  lists: ListWithMeta[];
  onItemAdded: () => void;
};

export default function QuickAddItem({ lists, onItemAdded }: Props) {
  const [selectedListId, setSelectedListId] = useState<string>(
    lists[0]?.id ?? "",
  );
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedList = lists.find((l) => l.id === selectedListId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!content.trim() || !selectedListId) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await addItem(selectedListId, content.trim());
      setContent("");
      setSuccess(true);
      onItemAdded();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSelect = (listId: string) => {
    setSelectedListId(listId);
    setDropdownOpen(false);
  };

  if (lists.length === 0) return null;

  return (
    <div>
      <div className={styles.container}>
        {/* Custom dropdown */}
        <div ref={dropdownRef} className={styles.selectWrapper}>
          <button
            className={styles.selectTrigger}
            onClick={() => setDropdownOpen((prev) => !prev)}
            disabled={loading}
          >
            <span className={styles.selectTriggerText}>
              {selectedList?.title ?? "Select a list"}
            </span>
            <HiChevronDown
              size={16}
              className={clsx(
                styles.selectTriggerIcon,
                dropdownOpen && styles.selectTriggerIconOpen,
              )}
            />
          </button>

          {dropdownOpen && (
            <div className={styles.selectDropdown}>
              {lists.map((list) => (
                <button
                  key={list.id}
                  className={clsx(
                    styles.selectOption,
                    list.id === selectedListId && styles.selectOptionSelected,
                  )}
                  onClick={() => handleSelect(list.id)}
                >
                  {list.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <input
          className={styles.input}
          type="text"
          placeholder="Add an item to this list..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        {/* Submit button */}
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={loading || !content.trim() || !selectedListId}
        >
          <HiPlus size={20} />
        </button>
      </div>

      {success && (
        <p className={`${styles.feedback} ${styles.success}`}>
          ✓ Item added successfully!
        </p>
      )}
      {error && <p className={`${styles.feedback} ${styles.error}`}>{error}</p>}
    </div>
  );
}
