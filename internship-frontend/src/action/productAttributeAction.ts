"use server";

import { revalidateTag } from "next/cache";

export const deleteAttribute = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;

  const res = await fetch(
    `http://localhost:5000/api/ProductAttribute/admin/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    revalidateTag("selectProductAttribute");
    revalidateTag("productAttributeList");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
