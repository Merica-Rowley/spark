import {
  type List,
  type ListMemberWithProfile,
  type ListRole,
} from "../../../types";

type Props = {
  list: List;
  members: ListMemberWithProfile[];
  role: ListRole;
};

export default function ListHeader({ list, members, role }: Props) {
  return (
    <div>
      <h1>{list.title}</h1>
      <p>
        {members.map((m, i) => (
          <span key={m.user_id}>
            {m.username}
            {m.role === "owner" ? " (owner)" : ""}
            {i < members.length - 1 ? ", " : ""}
          </span>
        ))}
      </p>
      <p>Your role: {role}</p>
    </div>
  );
}
