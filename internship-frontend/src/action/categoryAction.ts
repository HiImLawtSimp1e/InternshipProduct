"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";
import slugify from "slugify";

// Define the addCategory function
export const addCategory = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const title = formData.get("title") as string;
  const slug = slugify(title, { lower: true });

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(`http://localhost:5000/api/Category/admin`, {
      method: "POST",
      body: JSON.stringify({ title, slug }),
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
      revalidateTag("categoryListAdmin");
      revalidateTag("categorySelect");
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

// Define the updateCategory function
export const updateCategory = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const isActive = formData.get("isActive") === "true";
  const slug = slugify(title, { lower: true });

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(`http://localhost:5000/api/Category/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, slug, isActive }),
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
      revalidateTag("categoryListAdmin");
      revalidateTag("categorySelect");
      revalidateTag("categoryDetail");
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

export const deleteCategory = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Category/admin/${id}`, {
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
    revalidateTag("categoryListAdmin");
    revalidateTag("categorySelect");
    revalidatePath("/product");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
