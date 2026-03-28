import { useNavigate } from "react-router-dom";
import { type ListWithMeta } from "../../types";

type Props = {
  list: ListWithMeta;
};

export default function ListCard({ list }: Props) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/lists/${list.id}`)}>
      <span>{list.is_starred ? "⭐" : ""}</span>
      <span>{list.title}</span>
      <span>{list.role}</span>
    </div>
  );
}
