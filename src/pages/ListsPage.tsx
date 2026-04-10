import { useLists } from "../hooks/useLists";
import ListGrid from "../components/lists/ListGrid";
import CreateListModal from "../components/lists/CreateListModal";
import QuickAddItem from "../components/lists/QuickAddItem";
import { useState } from "react";

export default function ListsPage() {
  const { lists, loading, refreshing, error, refetch, removeList, toggleStar } =
    useLists();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <h1>My Lists</h1>
        <button onClick={() => setShowModal(true)}>+ Create List</button>
      </div>

      <QuickAddItem lists={lists} onItemAdded={refetch} />

      <ListGrid
        lists={lists}
        onDeleteList={removeList}
        onToggleStar={toggleStar}
        refreshing={refreshing} // optional — can show a subtle spinner
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
