"use server";

import { uploadImage } from "@/lib/cloudinary/cloudinary";
import { revalidatePath, revalidateTag } from "next/cache";

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
      // Handle server errors
      const errorResponse = await res.json();
      console.error(`Server error: ${JSON.stringify(errorResponse)}`);

      // Check if the error response contains a message field
      if (errorResponse && errorResponse.message) {
        return { errors: [errorResponse.message] };
      } else {
        return { errors: ["Server error occurred."] };
      }
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

export const updateProductImage = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;
  const productId = formData.get("productId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const isMain = formData.get("isMain") === "true";
  const isActive = formData.get("isActive") === "true";

  const productImageData: ProductImageFormData = {
    imageUrl,
    isActive,
    isMain,
    productId,
  };

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductImage/admin/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(productImageData),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      // Handle server errors
      const errorResponse = await res.json();
      console.error(`Server error: ${JSON.stringify(errorResponse)}`);

      // Check if the error response contains a message field
      if (errorResponse && errorResponse.message) {
        return { errors: [errorResponse.message] };
      } else {
        return { errors: ["Server error occurred."] };
      }
    }

    const responseData: ApiResponse<string> = await res.json();
    console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("productDetailAdmin");
      revalidateTag("getProductImage");
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

export const deleteProductImage = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;

  const res = await fetch(
    `http://localhost:5000/api/ProductImage/admin/${id}`,
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
    revalidateTag("productDetailAdmin");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
