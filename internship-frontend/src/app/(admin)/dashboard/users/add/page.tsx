import AddUserForm from "@/components/dashboard/user/add-user-form";
import { cookies as nextCookies } from "next/headers";

const AddUserPage = () => {
  const Product = async () => {
    const cookieStore = nextCookies();
    const token = cookieStore.get("authToken")?.value || "";

    const res = await fetch(`http://localhost:5000/api/Account/admin/role`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // header Authorization
      },
    });

    const roleSelect: ApiResponse<IRole[]> = await res.json();
    return <AddUserForm roleSelect={roleSelect.data} />;
  };
  return <Product />;
};
export default AddUserPage;
