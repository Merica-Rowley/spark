import { useState } from "react";
import { type ListItem, type ListMemberWithProfile } from "../../../types";
import Avatar from "../../common/Avatar";

type Props = {
  item: ListItem;
  listMembers: ListMemberWithProfile[];
  currentUserId: string;
  onClose: () => void;
  onPostCreated: () => void;
  onSkip: () => void;
  onCreatePost: (
    content: string | null,
    imageFile: File | null,
    participantIds: string[],
  ) => Promise<void>;
};

export default function CreatePostModal({
  item,
  listMembers,
  currentUserId,
  onClose,
  onPostCreated,
  onSkip,
  onCreatePost,
}: Props) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // exclude current user from collaborator picker since they are the author
  const eligibleMembers = listMembers.filter(
    (m) => m.user_id !== currentUserId,
  );

  const handleToggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError(null);
      await onCreatePost(
        content.trim() || null,
        imageFile,
        selectedParticipants,
      );
      onPostCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>🎉 You completed: {item.content}</h2>
        <button onClick={onClose}>✕</button>
      </div>

      <p>Would you like to create a post about this?</p>

      {/* Caption */}
      <div>
        <label>Caption (optional)</label>
        <textarea
          placeholder="Write something about this accomplishment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={300}
          disabled={loading}
        />
        <span>{content.length}/300</span>
      </div>

      {/* Image upload */}
      <div>
        <button
          disabled={loading}
          onClick={() => document.getElementById("post-image-upload")?.click()}
        >
          {imageFile ? imageFile.name : "Add Photo (optional)"}
        </button>
        <input
          id="post-image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        {imageFile && (
          <button onClick={() => setImageFile(null)}>Remove Photo</button>
        )}
      </div>

      {/* Collaborator picker */}
      {eligibleMembers.length > 0 && (
        <div>
          <label>Tag collaborators (optional)</label>
          {eligibleMembers.map((member) => (
            <div
              key={member.user_id}
              // onClick={() => handleToggleParticipant(member.user_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                avatarPath={member.avatar_url ?? null}
                userId={member.user_id}
                alt={member.username}
                size={32}
              />
              <span>{member.username}</span>
              <input
                type="checkbox"
                checked={selectedParticipants.includes(member.user_id)}
                onChange={() => handleToggleParticipant(member.user_id)}
              />
            </div>
          ))}
        </div>
      )}

      {error && <p>{error}</p>}

      <div>
        <button onClick={onSkip} disabled={loading}>
          Skip for now
        </button>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </div>
    </div>
  );
}
