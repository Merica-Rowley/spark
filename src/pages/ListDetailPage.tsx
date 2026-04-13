import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useListDetail } from "../hooks/useListDetail";
import { type ListItem } from "../types";
import { useAuth } from "../context/AuthContext";
import ListHeader from "../components/lists/list-detail/ListHeader";
import ListItemsGrid from "../components/lists/list-detail/ListItemsGrid";
import CreatePostModal from "../components/lists/list-detail/CreatePostModal";
import CompletedItemModal from "../components/lists/list-detail/CompletedItemModal";
import EditListModal from "../components/lists/list-detail/EditListModal";
import ManageMembersModal from "../components/lists/list-detail/ManageMembersModal";
import styles from "./ListDetailPage.module.css";
import { HiChevronLeft } from "react-icons/hi";
import { useConfirm } from "../hooks/useConfirm";
import ConfirmModal from "../components/common/ConfirmModal";

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
    createItemPost,
    deleteItemPost,
  } = useListDetail(id!);
  const { confirm, options, handleConfirm, handleCancel } = useConfirm();

  const [postModalItem, setPostModalItem] = useState<ListItem | null>(null);
  const [completedModalItem, setCompletedModalItem] = useState<ListItem | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const { profile } = useAuth();
  const currentUserId = profile.id;

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
    const confirmed = await confirm({
      title: "Leave List",
      message:
        "Are you sure you want to leave this list? You will need to be re-invited to rejoin.",
      confirmLabel: "Leave",
      variant: "danger",
    });
    if (!confirmed) return;
    await removeMember(currentUserId);
    navigate("/lists");
  };

  return (
    <div className={styles.page}>
      <div className={styles.backButton}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate("/lists")}
        >
          <HiChevronLeft size={18} />
          Back
        </button>
      </div>

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

      {postModalItem && currentUserId && (
        <CreatePostModal
          item={postModalItem}
          listMembers={listDetail.members}
          currentUserId={currentUserId}
          onClose={() => setPostModalItem(null)}
          onPostCreated={() => setPostModalItem(null)}
          onSkip={() => setPostModalItem(null)}
          onCreatePost={async (content, imageFile, participantIds) => {
            await createItemPost(
              postModalItem.id,
              content,
              imageFile,
              participantIds,
            );
          }}
        />
      )}

      {completedModalItem && currentUserId && (
        <CompletedItemModal
          item={completedModalItem}
          listMembers={listDetail.members}
          currentUserId={currentUserId}
          onClose={() => setCompletedModalItem(null)}
          onUncomplete={async () => {
            await uncompleteItem(completedModalItem.id);
            setCompletedModalItem(null);
          }}
          onCreatePost={() => {
            setPostModalItem(completedModalItem);
            setCompletedModalItem(null);
          }}
          onDeletePost={deleteItemPost}
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

      {options && (
        <ConfirmModal
          {...options}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
