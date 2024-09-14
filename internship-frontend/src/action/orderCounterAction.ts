"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";

export const applyVoucher = async (
  prevState: FormStateData<IVoucher>,
  formData: FormData
): Promise<FormStateData<IVoucher> | undefined> => {
  //declare errors
  const errors: string[] = [];

  const discountCode = formData.get("discountCode") as string;
  const totalAmount = formData.get("totalAmount")
    ? Number(formData.get("totalAmount"))
    : null;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(
    `http://localhost:5000/api/OrderCounter/apply-voucher?discountCode=${discountCode}&totalAmount=${totalAmount}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(res);

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
