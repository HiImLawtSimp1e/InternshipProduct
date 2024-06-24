"use server";

import { uploadImage } from "@/lib/cloudinary/cloudinary";
import { revalidatePath } from "next/cache";

interface ProductImageFormData {
  imageUrl?: string;
  isActive?: boolean | null;
  isMain?: boolean | null;
  productId?: string;
}

export const AddProductImage = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const productId = formData.get("productId") as string;
  const image = formData.get("image") as File;
  const isMain = formData.get("isMain") === "true";

  let imageUrl = "";

  if (image) {
    const result = await uploadImage(image, ["product-image"]);
    if (result && result.secure_url) {
      imageUrl = result.secure_url;
    }
  } else {
    return { errors: ["No file found"] };
  }

  const productImageData: ProductImageFormData = {
    imageUrl,
    isMain,
    productId,
  };

  try {
    const res = await fetch("http://localhost:5000/api/ProductImage/admin", {
      method: "POST",
      body: JSON.stringify(productImageData),
      headers: { "Content-Type": "application/json" },
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
    console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidatePath(`/dashboard/products/${productId}`);
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
