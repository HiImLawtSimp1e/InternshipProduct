"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";

// Define the ProductAttributeValueFormData interface
interface ProductAttributeValueFormData {
  productAttributeId: string;
  value: string;
  isActive?: boolean;
}

// Define the addAttributeValue function
export const addAttributeValue = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const productId = formData.get("productId") as string;
  const productAttributeId = formData.get("productAttributeId") as string;
  const value = formData.get("value") as string;

  // Prepare the product attribute value data
  const attributeValueData: ProductAttributeValueFormData = {
    productAttributeId,
    value,
  };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductValue/admin/${productId}`,
      {
        method: "POST",
        body: JSON.stringify(attributeValueData),
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
      revalidateTag("productListAdmin");
      revalidateTag("productDetailAdmin");
      revalidateTag("selectProductAttribute");
      revalidateTag("shopProductDetail");
      revalidatePath("/");
      revalidatePath("/product");
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

// Define the updateAttributeValue function
export const updateAttributeValue = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const productId = formData.get("productId") as string;
  const productAttributeId = formData.get("productAttributeId") as string;
  const value = formData.get("value") as string;
  const isActive = formData.get("isActive") === "true";

  // Prepare the variant data
  // Prepare the product attribute value data
  const attributeValueData: ProductAttributeValueFormData = {
    productAttributeId,
    value,
    isActive,
  };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductValue/admin/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(attributeValueData),
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

    // If the response is OK, parse the response data
    const responseData: ApiResponse<string> = await res.json();
    // console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("getVariant");
      revalidateTag("productListAdmin");
      revalidateTag("productDetailAdmin");
      revalidateTag("selectProductAttribute");
      revalidateTag("productDetailAdmin");
      revalidateTag("shopProductDetail");
      revalidatePath("/");
      revalidatePath("/product");
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

export const deleteAttributeValue = async (
  prevState: FormState,
  formData: FormData
) => {
  const productId = formData.get("productId") as string;
  const productAttributeId = formData.get("productAttributeId") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(
    `http://localhost:5000/api/ProductValue/admin/${productId}?productAttributeId=${productAttributeId}`,
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
    // If the response is success, revalidate the path and redirect
    revalidateTag("getAttributeValue");
    revalidateTag("productListAdmin");
    revalidateTag("productDetailAdmin");
    revalidateTag("selectProductAttribute");
    revalidateTag("shopProductDetail");
    revalidatePath("/");
    revalidatePath("/product");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
