"use server";

import { revalidateTag } from "next/cache";

// Define the addAttribute function
export const addAttribute = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const name = formData.get("name") as string;

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductAttribute/admin`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
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
    const { success, message } = responseData;

    if (success) {
      // If the response is success and success is true, revalidate the path and redirect
      revalidateTag("selectProductAttribute");
      revalidateTag("productAttributeList");
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

// Define the updateAttribute function
export const updateAttribute = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  try {
    const res = await fetch(
      `http://localhost:5000/api/ProductAttribute/admin/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ id, name }),
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
    // console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("selectProductAttribute");
      revalidateTag("productAttributeList");
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

export const deleteAttribute = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;

  const res = await fetch(
    `http://localhost:5000/api/ProductAttribute/admin/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    revalidateTag("selectProductAttribute");
    revalidateTag("productAttributeList");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
