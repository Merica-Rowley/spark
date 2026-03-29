import { type ListItem } from "../../../types";

type Props = {
  item: ListItem;
  onDelete: (itemId: string) => Promise<void>;
};

export default function ListItemCard({ item, onDelete }: Props) {
  return (
    <div>
      <span>{item.is_completed ? "✅" : "⬜"}</span>
      <span
        style={{ textDecoration: item.is_completed ? "line-through" : "none" }}
      >
        {item.content}
      </span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
}
