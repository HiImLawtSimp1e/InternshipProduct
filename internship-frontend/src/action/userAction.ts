"use server";

import { validateAddUser } from "@/lib/validation/validateUser";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface UserFormData {
  accountName: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  roleId: string;
}

export const createUser = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const accountName = formData.get("accountName") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const roleId = formData.get("roleId") as string;

  const [errors, isValid] = validateAddUser(
    accountName,
    password,
    fullName,
    email,
    phone,
    address
  );

  if (!isValid) {
    return { errors };
  }

  const userData: UserFormData = {
    accountName,
    password,
    fullName,
    email,
    phone,
    address,
    roleId,
  };

  const res = await fetch("http://localhost:5000/api/Account/admin", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    revalidatePath("/dashboard/users");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};

// export const updateUser = async (prevState: FormState, formData: FormData) => {
//   const id = formData.get("id") as number | null;
//   const username = formData.get("username") as string;
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const phone = formData.get("phone") as string;
//   const address = formData.get("address") as string;
//   const isAdmin = formData.get("isAdmin") === "true";
//   const isActive = formData.get("isActive") === "true";
//   const [errors, isValid] = validateUser(
//     username,
//     email,
//     password,
//     phone,
//     address
//   );

//   if (!isValid) {
//     return { errors };
//   }

//   const userData: UserFormData = {
//     username,
//     email,
//     password,
//     phone,
//     address,
//     isAdmin,
//     isActive,
//   };

//   await fetch(`http://localhost:8000/users/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(userData),
//     headers: { "Content-Type": "application/json" },
//   });
//   revalidatePath("/dashboard/users");
//   revalidateTag("userDetail");
//   redirect("/dashboard/users");
// };

export const deleteUser = async (formData: FormData) => {
  const id = formData.get("id") as number | null;

  await fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};
