"use server";

import { parseDateTimeToIso8601 } from "@/lib/format/parse";
import { validateVoucher } from "@/lib/validation/validateVoucher";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";

// Define the VoucherFormData interface
interface VoucherFormData {
  code: string;
  voucherName: string;
  isDiscountPercent?: boolean | null;
  discountValue: number | null;
  minOrderCondition: number | null;
  maxDiscountValue: number | null;
  quantity: number | null;
  startDate: string;
  endDate: string;
  isActive?: boolean | null;
}

export const addVoucher = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const code = formData.get("code") as string;
  const voucherName = formData.get("voucherName") as string;
  const isDiscountPercent = formData.get("isDiscountPercent") === "true";
  const discountValue = formData.get("discountValue")
    ? Number(formData.get("discountValue"))
    : null;
  const minOrderCondition = formData.get("minOrderCondition")
    ? Number(formData.get("minOrderCondition"))
    : 0;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : 1000;
  const startDate = parseDateTimeToIso8601(formData.get("startDate") as string);
  const endDate = parseDateTimeToIso8601(formData.get("endDate") as string);

  let maxDiscountValue;
  if (!isDiscountPercent) {
    maxDiscountValue = 0;
  } else {
    maxDiscountValue = formData.get("maxDiscountValue")
      ? Number(formData.get("maxDiscountValue"))
      : 0;
  }

  //client validation
  const [errors, isValid] = validateVoucher(
    voucherName,
    discountValue,
    minOrderCondition,
    maxDiscountValue,
    quantity,
    startDate,
    endDate,
    code,
    isDiscountPercent
  );

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const voucherData: VoucherFormData = {
    code,
    voucherName,
    isDiscountPercent,
    discountValue,
    minOrderCondition,
    maxDiscountValue,
    quantity,
    startDate,
    endDate,
  };
  //console.log(voucherData);

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch("http://localhost:5000/api/Voucher/admin", {
      method: "POST",
      body: JSON.stringify(voucherData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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
      revalidatePath("/dashboard/vouchers");
      revalidateTag("voucherDetail");
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

export const updateVoucher = async (
  prevState: FormState,
  formData: FormData
) => {
  const id = formData.get("id") as string;
  const code = formData.get("code") as string;
  const voucherName = formData.get("voucherName") as string;
  const isDiscountPercent = formData.get("isDiscountPercent") === "true";
  const discountValue = formData.get("discountValue")
    ? Number(formData.get("discountValue"))
    : null;
  const minOrderCondition = formData.get("minOrderCondition")
    ? Number(formData.get("minOrderCondition"))
    : 0;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : 1000;
  const startDate = parseDateTimeToIso8601(formData.get("startDate") as string);
  const endDate = parseDateTimeToIso8601(formData.get("endDate") as string);
  const isActive = formData.get("isActive") === "true";

  // if discount type is fixed => display maxDiscountValue
  let maxDiscountValue;
  if (!isDiscountPercent) {
    maxDiscountValue = 0;
  } else {
    maxDiscountValue = formData.get("maxDiscountValue")
      ? Number(formData.get("maxDiscountValue"))
      : 0;
  }

  //client validation
  const [errors, isValid] = validateVoucher(
    voucherName,
    discountValue,
    minOrderCondition,
    maxDiscountValue,
    quantity,
    startDate,
    endDate,
    code,
    isDiscountPercent
  );

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const voucherData: VoucherFormData = {
    code,
    voucherName,
    isDiscountPercent,
    discountValue,
    minOrderCondition,
    maxDiscountValue,
    quantity,
    startDate,
    endDate,
    isActive,
  };

  //console.log(voucherData);

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(`http://localhost:5000/api/Voucher/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(voucherData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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

    // If the response is OK, parse the response data
    const responseData: ApiResponse<string> = await res.json();
    // console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidatePath("/dashboard/vouchers");
      revalidateTag("voucherDetail");
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

export const deleteVoucher = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Voucher/admin/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    revalidatePath("/dashboard/vouchers");
    revalidateTag("voucherDetail");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
