"use server";

import { validateLogin, validateRegister } from "@/lib/validation/validateAuth";
import { cookies as nextCookies } from "next/headers";

interface LoginFormData {
  accountName: string;
  password: string;
}

interface RegisterFormData {
  accountName: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export const customerLoginAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //get value from formData
  const accountName = formData.get("accountName") as string;
  const password = formData.get("password") as string;
  const loginData: LoginFormData = { accountName, password };

  //client validation
  const [errors, isValid] = validateLogin(accountName, password);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  //fetch api [POST] /Auth/login
  const res = await fetch("http://localhost:5000/api/Auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { data, success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    const cookieStore = nextCookies();
    cookieStore.set("authToken", data);
    return { success: true, errors: [], data };
  } else {
    return { errors: [message] };
  }
};

export const adminLoginAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //get value from formData
  const accountName = formData.get("accountName") as string;
  const password = formData.get("password") as string;
  const loginData: LoginFormData = { accountName, password };

  //client validation
  const [errors, isValid] = validateLogin(accountName, password);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  //fetch api [POST] /Auth/admin/login
  const res = await fetch("http://localhost:5000/api/Auth/admin/login", {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { data, success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    const cookieStore = nextCookies();
    cookieStore.set("authToken", data);
    return { success: true, errors: [], data };
  } else {
    return { errors: [message] };
  }
};

export const registerAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //get value from formData
  const accountName = formData.get("accountName") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  const registerData: RegisterFormData = {
    accountName,
    password,
    confirmPassword,
    fullName,
    email,
    phone,
    address,
  };

  //client validation
  const [errors, isValid] = validateRegister(
    accountName,
    password,
    confirmPassword,
    fullName,
    email,
    phone,
    address
  );

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  //fetch api [POST] /Auth/register
  const res = await fetch("http://localhost:5000/api/Auth/register", {
    method: "POST",
    body: JSON.stringify(registerData),
    headers: { "Content-Type": "application/json" },
  });

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { data, success, message } = responseData;

  if (success) {
    // If the response is success, revalidate the path and redirect
    const cookieStore = nextCookies();
    cookieStore.set("authToken", data);
    return { success: true, errors: [], data };
  } else {
    return { errors: [message] };
  }
};
