import { useNavigate } from "react-router-dom";
import { type ListWithMeta } from "../../types";

type Props = {
  list: ListWithMeta;
  onDeleteList: (listId: string) => Promise<void>;
};

export default function ListCard({ list, onDeleteList }: Props) {
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent navigating to the list when clicking delete
    if (!confirm("Are you sure you want to delete this list?")) return;
    await onDeleteList(list.id);
  };

  return (
    <div onClick={() => navigate(`/lists/${list.id}`)}>
      <span>{list.is_starred ? "⭐" : ""}</span>
      <span>{list.title}</span>
      <span>{list.role}</span>
      {list.role === "owner" && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
}
