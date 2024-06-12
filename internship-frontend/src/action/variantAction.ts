"use server";

// Import the necessary modules and interfaces
import { validateVariant } from "@/lib/validation/validateVariant";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

// Define the VariantFormData interface
interface VariantFormData {
  productTypeId: string;
  price: number | null;
  originalPrice: number | null;
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

  const res = await fetch(
    `http://localhost:5000/api/ProductVariant/admin/${productId}`,
    {
      method: "POST",
      body: JSON.stringify(variantData),
      headers: { "Content-Type": "application/json" },
    }
  );

  // If the response is OK, revalidate the path and redirect
  revalidateTag("productListAdmin");
  revalidateTag("productDetailAdmin");
  revalidateTag("selectProductType");
  redirect(`/dashboard/products/${productId}`);
};
