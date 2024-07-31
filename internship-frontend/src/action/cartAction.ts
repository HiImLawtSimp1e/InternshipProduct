"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";

interface CartItemFormData {
  productId: string;
  productTypeId: string;
  quantity: number | null;
}

export const addCartItem = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : null;

  const cartItemData: CartItemFormData = { productId, productTypeId, quantity };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Cart`, {
    method: "POST",
    body: JSON.stringify(cartItemData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData: ApiResponse<string> = await res.json();
  //   console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If response is success, revalidate and redirect.
    revalidateTag("shoppingCart");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};

export const updateQuantity = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : null;

  const cartItemData: CartItemFormData = { productId, productTypeId, quantity };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Cart`, {
    method: "PUT",
    body: JSON.stringify(cartItemData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData: ApiResponse<string> = await res.json();
  //   console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If response is success, revalidate and redirect.
    revalidatePath("/cart");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};

export const removeCartItem = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(
    `http://localhost:5000/api/Cart/${productId}?productTypeId=${productTypeId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If response is success, revalidate and redirect.
    revalidateTag("shoppingCart");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
