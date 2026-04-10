import { useLists } from "../hooks/useLists";
import ListGrid from "../components/lists/ListGrid";
import CreateListModal from "../components/lists/CreateListModal";
import QuickAddItem from "../components/lists/QuickAddItem";
import { useState } from "react";

import styles from "./ListsPage.module.css";
import { HiPlus } from "react-icons/hi2";

export default function ListsPage() {
  const { lists, loading, refreshing, error, refetch, removeList, toggleStar } =
    useLists();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Lists</h1>
        <div className={styles.headerActions}>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <HiPlus size={18} />
            New List
          </button>
        </div>
      </div>

      <QuickAddItem lists={lists} onItemAdded={refetch} />

      <ListGrid
        lists={lists}
        onDeleteList={removeList}
        onToggleStar={toggleStar}
        refreshing={refreshing}
      />

      {showModal && (
        <CreateListModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
