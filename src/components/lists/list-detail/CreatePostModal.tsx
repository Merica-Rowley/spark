import { type ListItem } from "../../../types";

type Props = {
  item: ListItem;
  onClose: () => void;
  onPostCreated: () => void;
  onSkip: () => void;
};

export default function CreatePostModal({ item, onClose, onSkip }: Props) {
  return (
    <div>
      <div>
        <h2>🎉 You completed: {item.content}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      <p>Would you like to create a post about this?</p>
      <div>
        <button onClick={onSkip}>Skip for now</button>
        <button disabled>Create Post (coming soon)</button>
      </div>
    </div>
  );
}
