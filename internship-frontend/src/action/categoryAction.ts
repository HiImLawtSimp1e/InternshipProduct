"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

// Define the addCategory function
export const addCategory = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const title = formData.get("title") as string;
  const slug = slugify(title, { lower: true });

  const res = await fetch(`http://localhost:5000/api/Category/admin`, {
    method: "POST",
    body: JSON.stringify({ title, slug }),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  if (!success) {
    return { errors: [message] };
  }

  // If the response is OK, revalidate the path and redirect
  revalidateTag("categoryListAdmin");
  revalidateTag("categorySelect");
  redirect(`/dashboard/category`);
};

// Define the updateCategory function
export const updateCategory = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const isActive = formData.get("isActive") === "true";
  const slug = slugify(title, { lower: true });

  const res = await fetch(`http://localhost:5000/api/Category/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, slug, isActive }),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  if (!success) {
    return { errors: [message] };
  }

  // If the response is OK, revalidate the path and redirect
  revalidateTag("categoryListAdmin");
  revalidateTag("categorySelect");
  revalidateTag("categoryDetail");
  redirect(`/dashboard/category`);
};

export const deleteCategory = async (formData: FormData) => {
  const id = formData.get("id") as string;

  const res = await fetch(`http://localhost:5000/api/Category/admin/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  if (!success) {
    return { errors: [message] };
  }

  revalidateTag("categoryListAdmin");
  revalidateTag("categorySelect");
  redirect(`/dashboard/category`);
};
