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

export type ListItem = {
  id: string;
  list_id: string;
  content: string;
  position: number;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
};

export type ListMemberWithProfile = {
  user_id: string;
  role: ListRole;
  username: string;
};

export type ListDetail = {
  list: List;
  items: ListItem[];
  members: ListMemberWithProfile[];
  role: ListRole;
};
