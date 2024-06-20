import UserList from "@/components/dashboard/user/user-list";

const Users = async () => {
  const res = await fetch(`http://localhost:5000/api/Account/admin`, {
    method: "GET",
  });

  const responseData: ApiResponse<PagingParams<IUser[]>> = await res.json();
  const { data, success, message } = responseData;
  console.log(responseData);
  const { result, pages, currentPage } = data;

  return <UserList users={result} pages={pages} currentPage={currentPage} />;
};

const UsersPage = async () => {
  return (
    <>
      <Users />
    </>
  );
};

export default UsersPage;
