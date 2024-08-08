"use server";

import { validateAddress } from "@/lib/validation/validateProfile";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies as nextCookies } from "next/headers";

interface AddressFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isMain: boolean;
}

// Define the createAddress function
export const createAddress = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const isMain = formData.get("isMain") === "true";

  //client validation
  const [errors, isValid] = validateAddress(fullName, email, phone, address);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const addressData: AddressFormData = {
    fullName,
    email,
    phone,
    address,
    isMain,
  };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(`http://localhost:5000/api/Address`, {
      method: "POST",
      body: JSON.stringify(addressData),
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

    // If the response is OK, parse the response data
    const responseData: ApiResponse<string> = await res.json();
    const { success, message } = responseData;

    if (success) {
      // If the response is success and success is true, revalidate the path and redirect
      revalidateTag("addressList");
      revalidateTag("addressDetail");
      revalidateTag("mainAddress");
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

// Define the updateType function
export const updateAddress = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  // Extract the necessary fields from formData
  const id = formData.get("id") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const isMain = formData.get("isMain") === "true";

  //client validation
  const [errors, isValid] = validateAddress(fullName, email, phone, address);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const updateAddressData: AddressFormData = {
    fullName,
    email,
    phone,
    address,
    isMain,
  };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  try {
    const res = await fetch(`http://localhost:5000/api/Address/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateAddressData),
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

    // If the response is OK, parse the response data
    const responseData: ApiResponse<string> = await res.json();
    // console.log(responseData);
    const { success, message } = responseData;

    if (success) {
      // If the response is success, revalidate the path and redirect
      revalidateTag("addressList");
      revalidateTag("addressDetail");
      revalidateTag("mainAddress");
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

export const deleteAddress = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  const id = formData.get("id") as string;

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Address/${id}`, {
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
    revalidateTag("addressList");
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
