"use server";

import { validatePost } from "@/lib/validation/validatePost";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  seoKeyworks: string;
  isActive?: boolean | null;
}

export const addPost = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const seoKeyworks = formData.get("seoKeyworks") as string;
  const slug = slugify(title);

  const [errors, isValid] = validatePost(
    title,
    content,
    seoTitle,
    seoDescription,
    seoKeyworks
  );

  if (!isValid) {
    return { errors };
  }

  const postData: PostFormData = {
    title,
    slug,
    content,
    seoTitle,
    seoDescription,
    seoKeyworks,
  };

  try {
    const res = await fetch("http://localhost:5000/api/Post/admin", {
      method: "POST",
      body: JSON.stringify(postData),
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
      revalidatePath("/dashboard/posts");
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

export const updatePost = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const seoKeyworks = formData.get("seoKeyworks") as string;
  const isActive = formData.get("isActive") === "true";
  const slug = slugify(title);

  const [errors, isValid] = validatePost(
    title,
    content,
    seoTitle,
    seoDescription,
    seoKeyworks
  );

  if (!isValid) {
    return { errors };
  }

  const postData: PostFormData = {
    title,
    slug,
    content,
    seoTitle,
    seoDescription,
    seoKeyworks,
    isActive,
  };

  const res = await fetch(`http://localhost:5000/api/Post/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(postData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  console.log(data);

  if (!success) {
    console.log(message);
  }

  revalidatePath("/dashboard/posts");
  revalidateTag("postDetail");
  redirect("/dashboard/posts");
};

export const deletePost = async (formData: FormData) => {
  const id = formData.get("id") as number | null;

  await fetch(`http://localhost:5000/api/Post/admin/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
};
