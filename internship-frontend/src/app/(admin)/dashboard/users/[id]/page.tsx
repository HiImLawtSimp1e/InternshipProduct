import UserDetail from "@/components/dashboard/user/user-detail";

const User = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/Account/admin/${id}`, {
    method: "GET",
    next: { tags: ["userDetail"] },
  });

  const user: ApiResponse<IUser> = await res.json();

  return <UserDetail user={user.data} />;
};

const UserDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <User id={id} />
    </>
  );
};
export default UserDetailPage;
