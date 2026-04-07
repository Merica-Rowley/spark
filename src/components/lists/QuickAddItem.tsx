import { useState } from "react";
import { type ListWithMeta } from "../../types";
import { addItem } from "../../lib/lists";

type Props = {
  lists: ListWithMeta[];
};

export default function QuickAddItem({ lists }: Props) {
  const [selectedListId, setSelectedListId] = useState<string>(
    lists[0]?.id ?? "",
  );
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || !selectedListId) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await addItem(selectedListId, content.trim());

      setContent("");
      setSuccess(true);
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

  if (lists.length === 0) return null;

  return (
    <div>
      <select
        value={selectedListId}
        onChange={(e) => setSelectedListId(e.target.value)}
        disabled={loading}
      >
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.title}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Add an item to this list..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !content.trim() || !selectedListId}
      >
        {loading ? "Adding..." : "Add"}
      </button>

      {success && <p>Item added successfully!</p>}
      {error && <p>{error}</p>}
    </div>
  );
}
