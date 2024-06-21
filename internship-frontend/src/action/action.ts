"use server";

import { uploadImage } from "@/lib/cloudinary/cloudinary";

export const create = async (formData: FormData) => {
  const file = formData.get("image") as File;
  if (file) {
    const result = await uploadImage(file, ["product-image"]);
    if (result && result.secure_url) {
      console.log(result.secure_url);
    }
  } else {
    throw new Error("No file found");
  }
};
