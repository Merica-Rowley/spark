import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useListDetail } from "../hooks/useListDetail";
import { supabase } from "../lib/supabaseClient";
import { type ListItem } from "../types";
import ListHeader from "../components/lists/list-detail/ListHeader";
import ListItemsGrid from "../components/lists/list-detail/ListItemsGrid";
import CreatePostModal from "../components/lists/list-detail/CreatePostModal";
import CompletedItemModal from "../components/lists/list-detail/CompletedItemModal";
import EditListModal from "../components/lists/list-detail/EditListModal";
import ManageMembersModal from "../components/lists/list-detail/ManageMembersModal";

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
    toggleStar,
    updateListDetails,
    addMember,
    removeMember,
    transferOwnership,
    getAvailableFriends,
  } = useListDetail(id!);

  const [postModalItem, setPostModalItem] = useState<ListItem | null>(null);
  const [completedModalItem, setCompletedModalItem] = useState<ListItem | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // get current user id for member management
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listDetail) return <div>List not found</div>;

  const handleItemCheck = async (item: ListItem) => {
    await completeItem(item.id);
    setPostModalItem(item);
  };

  const handleCompletedItemClick = (item: ListItem) => {
    setCompletedModalItem(item);
  };

  const handleLeaveList = async () => {
    if (!currentUserId) return;
    if (!confirm("Are you sure you want to leave this list?")) return;
    await removeMember(currentUserId);
    navigate("/lists");
  };

  return (
    <div>
      <button onClick={() => navigate("/lists")}>← Back</button>
      <ListHeader
        list={listDetail.list}
        members={listDetail.members}
        role={listDetail.role}
        isStarred={listDetail.is_starred}
        onToggleStar={() => toggleStar(listDetail.is_starred)}
        onEdit={() => setShowEditModal(true)}
        onManageMembers={() => setShowMembersModal(true)}
        onLeaveList={handleLeaveList}
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

      {showEditModal && (
        <EditListModal
          list={listDetail.list}
          onClose={() => setShowEditModal(false)}
          onSaved={async (title, imageFile, resetImage) => {
            await updateListDetails(title, imageFile, resetImage);
            setShowEditModal(false);
          }}
        />
      )}

      {showMembersModal && currentUserId && (
        <ManageMembersModal
          listId={id!}
          members={listDetail.members}
          currentUserId={currentUserId}
          onClose={() => setShowMembersModal(false)}
          onAddMember={addMember}
          onRemoveMember={removeMember}
          onTransferOwnership={transferOwnership}
          getAvailableFriends={getAvailableFriends}
        />
      )}
    </div>
  );
}
