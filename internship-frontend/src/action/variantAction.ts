"use server";

// Import the necessary modules and interfaces
import { validateVariant } from "@/lib/validation/validateVariant";
import { revalidateTag } from "next/cache";

// Define the VariantFormData interface
interface VariantFormData {
  productTypeId: string;
  price: number | null;
  originalPrice: number | null;
  quantity?: number | null;
  isActive?: boolean;
}

// Define the addVariant function
export const addVariant = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;
  const price = formData.get("price") ? Number(formData.get("price")) : null;
  const originalPrice = formData.get("originalPrice")
    ? Number(formData.get("originalPrice"))
    : null;

  // Validate the extracted fields
  const [errors, isValid] = validateVariant(
    productTypeId,
    price,
    originalPrice
  );

  // If the data is not valid, return errors
  if (!isValid) {
    return { errors };
  }

  // Prepare the variant data
  const variantData: VariantFormData = {
    productTypeId,
    price,
    originalPrice,
  };

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductVariant/admin/${productId}`,
      {
        method: "POST",
        body: JSON.stringify(variantData),
        headers: { "Content-Type": "application/json" },
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
    console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("productListAdmin");
      revalidateTag("productDetailAdmin");
      revalidateTag("selectProductType");
      revalidateTag("shopProductDetail");
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

// Define the updateVariant function
export const updateVariant = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;
  const price = formData.get("price") ? Number(formData.get("price")) : null;
  const originalPrice = formData.get("originalPrice")
    ? Number(formData.get("originalPrice"))
    : null;
  const quantity = formData.get("quantity")
    ? Number(formData.get("quantity"))
    : null;
  const isActive = formData.get("isActive") === "true";

  // Validate the extracted fields
  const [errors, isValid] = validateVariant(
    productTypeId,
    price,
    originalPrice,
    quantity
  );

  // If the data is not valid, return errors
  if (!isValid) {
    return { errors };
  }

  // Prepare the variant data
  const variantData: VariantFormData = {
    productTypeId,
    price,
    originalPrice,
    quantity,
    isActive,
  };

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductVariant/admin/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(variantData),
        headers: { "Content-Type": "application/json" },
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
    console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("getVariant");
      revalidateTag("productListAdmin");
      revalidateTag("productDetailAdmin");
      revalidateTag("selectProductType");
      revalidateTag("productDetailAdmin");
      revalidateTag("shopProductDetail");
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

export const deleteVariant = async (
  prevState: FormState,
  formData: FormData
) => {
  const productId = formData.get("productId") as string;
  const productTypeId = formData.get("productTypeId") as string;

  const res = await fetch(
    `http://localhost:5000/api/ProductVariant/admin/${productId}?productTypeId=${productTypeId}`,
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
    revalidateTag("getVariant");
    revalidateTag("productListAdmin");
    revalidateTag("productDetailAdmin");
    revalidateTag("selectProductType");
    revalidateTag("shopProductDetail");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
