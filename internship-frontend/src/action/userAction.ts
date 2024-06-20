"use server";

import {
  validateAddUser,
  validateUpdateUser,
} from "@/lib/validation/validateUser";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface AddUserFormData {
  accountName: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  roleId: string;
}

interface UpdateUserFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive?: boolean | null;
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

  const userData: AddUserFormData = {
    accountName,
    password,
    fullName,
    email,
    phone,
    address,
    roleId,
  };

  try {
    const res = await fetch("http://localhost:5000/api/Account/admin", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // Handle server errors
      const errorResponse = await res.json();
      console.error(`Server error: ${JSON.stringify(errorResponse)}`);

      // Check if the error response contains a message field
      if (errorResponse && errorResponse.message) {
        return { errors: [errorResponse.message] };
      } else {
        return { errors: ["Server error occurred."] };
      }
    }

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
  } catch (error) {
    console.error(`Error parsing JSON: ${error}`);
    return { errors: ["Error parsing server response."] };
  }
};

export const updateUser = async (prevState: FormState, formData: FormData) => {
  const id = formData.get("id") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const isActive = formData.get("isActive") === "true";
  const [errors, isValid] = validateUpdateUser(fullName, email, phone, address);

  if (!isValid) {
    return { errors };
  }

  const userData: UpdateUserFormData = {
    fullName,
    email,
    phone,
    address,
    isActive,
  };

  try {
    const res = await fetch(`http://localhost:5000/api/Account/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // Handle server errors
      const errorResponse = await res.json();
      console.error(`Server error: ${JSON.stringify(errorResponse)}`);

      // Check if the error response contains a message field
      if (errorResponse && errorResponse.message) {
        return { errors: [errorResponse.message] };
      } else {
        return { errors: ["Server error occurred."] };
      }
    }

    const responseData: ApiResponse<string> = await res.json();
    console.log(responseData);

    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidatePath("/dashboard/users");
      revalidateTag("userDetail");
      return { success: true, errors: [] };
    } else {
      return { errors: [message] };
    }
  } catch (error) {
    console.error(`Error parsing JSON: ${error}`);
    return { errors: ["Error parsing server response."] };
  }
};

export const deleteUser = async (prevState: FormState, formData: FormData) => {
  const id = formData.get("id") as string;

  const res = await fetch(`http://localhost:5000/api/Account/admin/${id}`, {
    method: "DELETE",
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
