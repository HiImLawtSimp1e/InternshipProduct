"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface CartItemFormData {
  productId: string;
  productTypeId: string;
  quantity: number | null;
}

export const addCartItem = async (formData: FormData) => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : null;

  const cartItemData: CartItemFormData = { productId, productTypeId, quantity };

  const res = await fetch(`http://localhost:5000/api/Cart`, {
    method: "POST",
    body: JSON.stringify(cartItemData),
    headers: { "Content-Type": "application/json" },
  });
  const responseData: ApiResponse<string> = await res.json();
  //   console.log(responseData);
  const { success, message } = responseData;

  revalidateTag("shoppingCart");
};

export const updateQuantity = async (formData: FormData) => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : null;

  const cartItemData: CartItemFormData = { productId, productTypeId, quantity };

  const res = await fetch(`http://localhost:5000/api/Cart`, {
    method: "PUT",
    body: JSON.stringify(cartItemData),
    headers: { "Content-Type": "application/json" },
  });
  const responseData: ApiResponse<string> = await res.json();
  //   console.log(responseData);
  const { success, message } = responseData;

  revalidatePath("/cart");
};

export const removeCartItem = async (formData: FormData) => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;

  const res = await fetch(
    `http://localhost:5000/api/Cart/${productId}?productTypeId=${productTypeId}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
  //   console.log(res);
  revalidateTag("shoppingCart");
};
