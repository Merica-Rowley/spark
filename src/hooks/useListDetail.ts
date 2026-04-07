import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  starList,
  unstarList,
  updateList,
  addListMember,
  removeListMember,
  transferListOwnership,
  getFriendsNotOnList,
} from "../lib/lists";
import { createPost, deletePost } from "../lib/posts";
import { type Friend, type ListDetail } from "../types";

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

  async function completeItem(itemId: string) {
    try {
      const { error } = await supabase.rpc("complete_item", {
        p_item_id: itemId,
      });
      if (error) throw error;
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to complete item");
    }
  }

  async function uncompleteItem(itemId: string) {
    try {
      const { error } = await supabase.rpc("uncomplete_item", {
        p_item_id: itemId,
      });
      if (error) throw error;
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to uncomplete item");
    }
  }

  async function createItemPost(
    listItemId: string,
    content: string | null,
    imageFile: File | null,
    participantIds: string[],
  ) {
    try {
      await createPost(listItemId, content, imageFile, participantIds);
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to create post");
    }
  }

  async function deleteItemPost(postId: string) {
    try {
      await deletePost(postId);
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to delete post");
    }
  }

  async function updateListDetails(
    title: string,
    newImageFile: File | null,
    resetImage: boolean = false,
  ) {
    try {
      await updateList(
        listId,
        title,
        listDetail?.list.image_url ?? null,
        newImageFile,
        resetImage,
      );
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update list");
    }
  }

  async function toggleStar(currentlyStarred: boolean) {
    try {
      if (currentlyStarred) {
        await unstarList(listId);
      } else {
        await starList(listId);
      }
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update star");
    }
  }

  async function addMember(userId: string) {
    try {
      await addListMember(listId, userId);
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to add member");
    }
  }

  async function removeMember(userId: string) {
    try {
      await removeListMember(listId, userId);
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to remove member");
    }
  }

  async function transferOwnership(newOwnerId: string) {
    try {
      await transferListOwnership(listId, newOwnerId);
      await fetchListDetail();
    } catch (err) {
      throw err instanceof Error
        ? err
        : new Error("Failed to transfer ownership");
    }
  }

  async function getAvailableFriends(): Promise<Friend[]> {
    try {
      return await getFriendsNotOnList(listId);
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to fetch friends");
    }
  }

  return {
    listDetail,
    loading,
    error,
    refetch: fetchListDetail,
    addItem,
    deleteItem,
    completeItem,
    uncompleteItem,
    toggleStar,
    updateListDetails,
    addMember,
    removeMember,
    transferOwnership,
    getAvailableFriends,
    createItemPost,
    deleteItemPost,
  };
}
