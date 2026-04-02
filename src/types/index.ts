// Lists

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
  is_starred: boolean;
  items: ListItem[];
  members: ListMemberWithProfile[];
  role: ListRole;
};

// Friends

export type Friend = {
  friend_id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
};

export type FriendInvite = {
  id: string;
  invited_by: string;
  invite_code: string;
  accepted_by: string | null;
  accepted_at: string | null;
  created_at: string;
  expires_at: string;
};

//  Profile

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
};
