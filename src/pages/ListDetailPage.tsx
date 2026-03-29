import { useParams, useNavigate } from "react-router-dom";
import { useListDetail } from "../hooks/useListDetail";
import ListHeader from "../components/lists/list-detail/ListHeader";
import ListItemsGrid from "../components/lists/list-detail/ListItemsGrid";

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listDetail, loading, error, addItem, deleteItem } = useListDetail(
    id!,
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listDetail) return <div>List not found</div>;

  return (
    <div>
      <button onClick={() => navigate("/lists")}>← Back</button>
      <ListHeader
        list={listDetail.list}
        members={listDetail.members}
        role={listDetail.role}
      />
      <ListItemsGrid
        items={listDetail.items}
        role={listDetail.role}
        onAddItem={addItem}
        onDeleteItem={deleteItem}
      />
    </div>
  );
}
