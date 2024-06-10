"use server";

import { validateUser } from "@/lib/validation/validateUser";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface UserFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  isAdmin: boolean | null;
  isActive: boolean | null;
}

export const createUser = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const isAdmin = formData.get("isAdmin") === "true";
  const isActive = formData.get("isActive") === "true";
  const createdAt = new Date().toISOString();

  const [errors, isValid] = validateUser(
    username,
    email,
    password,
    phone,
    address
  );

  if (!isValid) {
    return { errors };
  }

  const userData: UserFormData = {
    username,
    email,
    password,
    phone,
    address,
    isAdmin,
    isActive,
  };

  await fetch("http://localhost:8000/users", {
    method: "POST",
    body: JSON.stringify({ ...userData, createdAt }),
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const updateUser = async (prevState: FormState, formData: FormData) => {
  const id = formData.get("id") as number | null;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const isAdmin = formData.get("isAdmin") === "true";
  const isActive = formData.get("isActive") === "true";
  const [errors, isValid] = validateUser(
    username,
    email,
    password,
    phone,
    address
  );

  if (!isValid) {
    return { errors };
  }

  const userData: UserFormData = {
    username,
    email,
    password,
    phone,
    address,
    isAdmin,
    isActive,
  };

  await fetch(`http://localhost:8000/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/dashboard/users");
  revalidateTag("userDetail");
  redirect("/dashboard/users");
};

export const deleteUser = async (formData: FormData) => {
  const id = formData.get("id") as number | null;

  await fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};
