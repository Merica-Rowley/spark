export type ListRole = "owner" | "member";

export type List = {
  id: string;
  title: string;
  created_by: string;
  is_public: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ListMember = {
  user_id: string;
  list_id: string;
  role: ListRole;
  joined_at: string;
};

// This is what getUserLists() actually returns after the .map()
export type ListWithMeta = List & {
  is_starred: boolean;
  role: ListRole;
};
