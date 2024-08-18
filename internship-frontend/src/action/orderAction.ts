"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";

export const placeOrder = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //declare errors
  const errors: string[] = [];

  const voucherId = formData.get("voucherId") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  let url = "";
  if (!voucherId || voucherId === "") {
    url = "http://localhost:5000/api/Order/place-order";
  } else {
    url = `http://localhost:5000/api/Order/place-order?voucherId=${voucherId}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData: ApiResponse<string> = await res.json();
  //console.log(responseData);
  const { success, message } = responseData;

  //catch error
  if (!success) {
    errors.push(message);
  }
  if (errors.length > 0) {
    return { errors };
  }

  revalidateTag("shoppingCart");

  return { success: true, errors: [] };
};

export const cancelOrder = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //declare errors
  const errors: string[] = [];

  const orderId = formData.get("orderId") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(
    `http://localhost:5000/api/Order/cancel-order/${orderId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseData: ApiResponse<boolean> = await res.json();
  //console.log(responseData);
  const { success, message } = responseData;

  //catch error
  if (!success) {
    revalidatePath("/order-history");
    errors.push(message);
  }
  if (errors.length > 0) {
    return { errors };
  }

  return { success: true, errors: [] };
};

export const applyVoucher = async (
  prevState: FormStateData<IVoucher>,
  formData: FormData
): Promise<FormStateData<IVoucher> | undefined> => {
  //declare errors
  const errors: string[] = [];

  const discountCode = formData.get("discountCode") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(
    `http://localhost:5000/api/Order/apply-voucher?discountCode=${discountCode}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseData: ApiResponse<IVoucher> = await res.json();
  //console.log(responseData);
  const { data, success, message } = responseData;

  //catch error
  if (!success) {
    errors.push(message);
  }
  if (errors.length > 0) {
    return { errors };
  }

  revalidateTag("shoppingCart");

  return { data, success: true, errors: [] };
};

export const updateOrderState = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;
  const state = formData.get("state") as string;

  try {
    //get access token form cookie
    const cookieStore = nextCookies();
    const token = cookieStore.get("authToken")?.value || "";

    const res = await fetch(
      `http://localhost:5000/api/Order/admin/${id}?state=${state}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      // If the response is not OK, parse the error response
      const errorResponse = await res.json();
      const { errors } = errorResponse;

      // Create an array to hold error messages
      let errorMessages: string[] = [];

      // Check if there are specific validation errors and add them to the error messages
      if (errors) {
        for (const key in errors) {
          if (errors.hasOwnProperty(key)) {
            errorMessages = errorMessages.concat(errors[key]);
          }
        }
      }
      // Return the updated state with errors
      return { errors: errorMessages };
    }

    const responseData: ApiResponse<string> = await res.json();
    // console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("orderDetail");
      revalidateTag("orderCustomerDetail");
      return { success: true, errors: [] };
    } else {
      return { errors: [message] };
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error:", error);
    return { errors: ["An unexpected error occurred. Please try again."] };
  }
};
