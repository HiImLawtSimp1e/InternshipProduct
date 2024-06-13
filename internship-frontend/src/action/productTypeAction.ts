"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// Define the addType function
export const addType = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const name = formData.get("name") as string;

  const res = await fetch(`http://localhost:5000/api/ProductType/admin`, {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  if (!success) {
    return { errors: [message] };
  }

  // If the response is OK, revalidate the path and redirect
  revalidateTag("selectProductType");
  revalidateTag("productTypeList");
  redirect(`/dashboard/product-types`);
};

// Define the updateType function
export const updateType = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  const res = await fetch(`http://localhost:5000/api/ProductType/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, name }),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  if (!success) {
    return { errors: [message] };
  }

  // If the response is OK, revalidate the path and redirect
  revalidateTag("selectProductType");
  revalidateTag("productTypeList");
  redirect(`/dashboard/product-types`);
};

export const deleteType = async (formData: FormData) => {
  const id = formData.get("id") as string;

  const res = await fetch(`http://localhost:5000/api/ProductType/admin/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  if (!success) {
    return { errors: [message] };
  }

  revalidateTag("selectProductType");
  revalidateTag("productTypeList");
  redirect(`/dashboard/product-types`);
};
