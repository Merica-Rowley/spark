import { useState, useEffect } from "react";
import { getUserLists, deleteList } from "../lib/lists";
import { type ListWithMeta } from "../types";

export function useLists() {
  const [lists, setLists] = useState<ListWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLists();
  }, []);

  async function fetchLists() {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserLists();
      setLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch lists");
    } finally {
      setLoading(false);
    }
  }

  async function removeList(listId: string) {
    try {
      await deleteList(listId);
      setLists((prev) => prev.filter((list) => list.id !== listId));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to delete list");
    }
  }

  return { lists, loading, error, refetch: fetchLists, removeList };
}
