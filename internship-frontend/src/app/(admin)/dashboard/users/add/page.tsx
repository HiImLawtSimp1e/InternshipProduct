import AddUserForm from "@/components/dashboard/user/add-user-form";

const AddUserPage = () => {
  const Product = async () => {
    const res = await fetch(`http://localhost:5000/api/Account/admin/role`, {
      method: "GET",
    });

    const roleSelect: ApiResponse<IRole[]> = await res.json();
    return <AddUserForm roleSelect={roleSelect.data} />;
  };
  return <Product />;
};
export default AddUserPage;
