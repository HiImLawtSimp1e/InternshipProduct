"use server";

import { revalidateTag } from "next/cache";

export const placeOrder = async (formData: FormData) => {
  const res = await fetch(`http://localhost:5000/api/Order/place-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { success, message } = responseData;

  revalidateTag("shoppingCart");
};
