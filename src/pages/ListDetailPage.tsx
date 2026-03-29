import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useListDetail } from "../hooks/useListDetail";
import { type ListItem } from "../types";
import ListHeader from "../components/lists/list-detail/ListHeader";
import ListItemsGrid from "../components/lists/list-detail/ListItemsGrid";
import CreatePostModal from "../components/lists/list-detail/CreatePostModal";
import CompletedItemModal from "../components/lists/list-detail/CompletedItemModal";

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    listDetail,
    loading,
    error,
    addItem,
    deleteItem,
    completeItem,
    uncompleteItem,
  } = useListDetail(id!);

  const [postModalItem, setPostModalItem] = useState<ListItem | null>(null);
  const [completedModalItem, setCompletedModalItem] = useState<ListItem | null>(
    null,
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listDetail) return <div>List not found</div>;

  const handleItemCheck = async (item: ListItem) => {
    await completeItem(item.id);
    setPostModalItem(item); // open post modal after completing
  };

  const handleCompletedItemClick = (item: ListItem) => {
    setCompletedModalItem(item); // open completed item modal
  };

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
        onItemCheck={handleItemCheck}
        onCompletedItemClick={handleCompletedItemClick}
      />

      {postModalItem && (
        <CreatePostModal
          item={postModalItem}
          onClose={() => setPostModalItem(null)}
          onPostCreated={() => setPostModalItem(null)}
          onSkip={() => setPostModalItem(null)}
        />
      )}

      {completedModalItem && (
        <CompletedItemModal
          item={completedModalItem}
          onClose={() => setCompletedModalItem(null)}
          onUncomplete={async () => {
            await uncompleteItem(completedModalItem.id);
            setCompletedModalItem(null);
          }}
          onCreatePost={() => {
            setPostModalItem(completedModalItem);
            setCompletedModalItem(null);
          }}
        />
      )}
    </div>
  );
}
