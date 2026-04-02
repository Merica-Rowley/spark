import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { uploadListImage } from "../../lib/storage";
import { getFriends } from "../../lib/friends";
import { addListMember } from "../../lib/lists";
import { type Friend } from "../../types";
import MemberPicker from "./MemberPicker";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateListModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  useEffect(() => {
    getFriends().then(setFriends).catch(console.error);
  }, []);

  const handleToggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.friend_id === friend.friend_id)
        ? prev.filter((f) => f.friend_id !== friend.friend_id)
        : [...prev, friend],
    );
  };

  const handleCreate = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // create the list first to get the ID
      const { data: listId, error: createError } = await supabase.rpc(
        "create_list",
        {
          p_title: title.trim(),
          p_is_public: false,
        },
      );

      if (createError) throw createError;

      // upload image if one was selected
      if (imageFile && listId) {
        const imagePath = await uploadListImage(listId, imageFile);

        // update the list with the image path
        const { error: updateError } = await supabase
          .from("lists")
          .update({ image_url: imagePath })
          .eq("id", listId);

        if (updateError) throw updateError;
      }

      await Promise.all(
        selectedFriends.map((friend) =>
          addListMember(listId, friend.friend_id),
        ),
      );

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Create New List</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <input
        type="text"
        placeholder="List title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <label>Cover image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {friends.length > 0 && (
        <div>
          <label>Add collaborators (optional)</label>
          <MemberPicker
            availableFriends={friends}
            selectedFriends={selectedFriends}
            onToggleFriend={handleToggleFriend}
          />
        </div>
      )}

      {error && <p>{error}</p>}

      <div>
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button onClick={handleCreate} disabled={loading || !title.trim()}>
          {loading ? "Creating..." : "Create List"}
        </button>
      </div>
    </div>
  );
}
