import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { type ListDetail } from "../types";

export function useListDetail(listId: string) {
  const [listDetail, setListDetail] = useState<ListDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListDetail();
  }, [listId]);

  async function fetchListDetail() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc("get_list_detail", {
        p_list_id: listId,
      });

      if (error) throw error;
      if (!data) throw new Error("List not found");

      setListDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch list");
    } finally {
      setLoading(false);
    }
  }

  async function addItem(content: string) {
    try {
      const { error } = await supabase.rpc("add_list_item", {
        p_list_id: listId,
        p_content: content,
      });

      if (error) throw error;

      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to add item");
    }
  }

  async function deleteItem(itemId: string) {
    try {
      const { error } = await supabase
        .from("list_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      // Update local state directly rather than refetching
      setListDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        };
      });
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to delete item");
    }
  }

  return {
    listDetail,
    loading,
    error,
    refetch: fetchListDetail,
    addItem,
    deleteItem,
  };
}
