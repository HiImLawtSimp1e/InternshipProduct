"use server";

import { revalidateTag } from "next/cache";

export const deleteAttributeValue = async (
  prevState: FormState,
  formData: FormData
) => {
  const productId = formData.get("productId") as string;
  const productAttributeId = formData.get("productAttributeId") as string;

  const res = await fetch(
    `http://localhost:5000/api/ProductValue/admin/${productId}?productAttributeId=${productAttributeId}`,
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
    revalidateTag("getAttributeValue");
    revalidateTag("productListAdmin");
    revalidateTag("productDetailAdmin");
    revalidateTag("selectProductAttribute");
    revalidateTag("shopProductDetail");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
