import UserList from "@/components/dashboard/user/user-list";

const Users = async () => {
  const res = await fetch(`http://localhost:8000/users`, {
    method: "GET",
  });

  const users = await res.json();

  return <UserList users={users} />;
};

const UsersPage = async () => {
  return (
    <>
      <Users />
    </>
  );
};

export default UsersPage;
