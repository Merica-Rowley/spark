import { useState, useEffect } from "react";
import { getUserLists } from "../lib/lists";
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

  return { lists, loading, error, refetch: fetchLists };
}
