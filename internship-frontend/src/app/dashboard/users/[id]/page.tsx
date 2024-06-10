import UserDetail from "@/components/dashboard/user/user-detail";

const User = async ({ id }: { id: number }) => {
  const res = await fetch(`http://localhost:8000/users/${id}`, {
    method: "GET",
    next: { tags: ["userDetail"] },
  });

  const data = await res.json();
  const user = { ...data };
  console.log(user);

  return <UserDetail user={user} />;
};

const UserDetailPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <>
      <User id={id} />
    </>
  );
};
export default UserDetailPage;
