"use server";

import { validateProduct } from "@/lib/validation/validateProduct";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

// Define the updated ProductFormData interface
interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeyworks: string;
  slug: string;
  isActive?: boolean | null;
  categoryId?: string;
}

export const addProduct = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const seoKeyworks = formData.get("seoKeyworks") as string;
  const categoryId = formData.get("categoryId") as string;
  const slug = slugify(title, { lower: true });

  const [errors, isValid] = validateProduct(
    title,
    description,
    imageUrl,
    seoTitle,
    seoDescription,
    seoKeyworks
  );

  if (!isValid) {
    return { errors };
  }

  const productData: ProductFormData = {
    title,
    description,
    imageUrl,
    seoTitle,
    seoDescription,
    seoKeyworks,
    slug,
    categoryId,
  };

  const res = await fetch("http://localhost:5000/api/Product/admin", {
    method: "POST",
    body: JSON.stringify(productData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  console.log(data);

  if (!success) {
    console.log(message);
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const updateProduct = async (
  prevState: FormState,
  formData: FormData
) => {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const seoKeyworks = formData.get("seoKeyworks") as string;
  const isActive = formData.get("isActive") === "true";
  const categoryId = formData.get("categoryId") as string;
  const slug = slugify(title, { lower: true });

  const [errors, isValid] = validateProduct(
    title,
    description,
    imageUrl,
    seoTitle,
    seoDescription,
    seoKeyworks
  );

  if (!isValid) {
    return { errors };
  }

  const productData: ProductFormData = {
    title,
    description,
    imageUrl,
    seoTitle,
    seoDescription,
    seoKeyworks,
    slug,
    categoryId,
    isActive,
  };

  const res = await fetch(`http://localhost:5000/api/Product/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  console.log(responseData);
  const { data, success, message } = responseData;

  console.log(data);

  if (!success) {
    console.log(message);
  }

  revalidatePath("/dashboard/products");
  revalidateTag("productDetailAdmin");
  redirect("/dashboard/products");
};

export const deleteProduct = async (formData: FormData) => {
  const id = formData.get("id") as number | null;

  await fetch(`http://localhost:5000/api/Product/admin/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};
