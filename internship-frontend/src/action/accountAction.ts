"use server";

import {
  validateLogin,
  validatePassword,
  validateRegister,
} from "@/lib/validation/validateAuth";
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

interface ChangePasswordFormData {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export const customerLoginAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //get value from formData
  const accountName = formData.get("accountName") as string;
  const password = formData.get("password") as string;

  //client validation
  const [errors, isValid] = validateLogin(accountName, password);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const loginData: LoginFormData = { accountName, password };

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

  //client validation
  const [errors, isValid] = validateLogin(accountName, password);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const loginData: LoginFormData = { accountName, password };

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

  const registerData: RegisterFormData = {
    accountName,
    password,
    confirmPassword,
    fullName,
    email,
    phone,
    address,
  };

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

export const changePasswordAction = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //get value from formData
  const oldPassword = formData.get("oldPassword") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  //client validation
  const [errors, isValid] = validatePassword(password, confirmPassword);

  if (!isValid) {
    //console.log(errors);
    return { errors };
  }

  const changePasswordData: ChangePasswordFormData = {
    oldPassword,
    password,
    confirmPassword,
  };

  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  //fetch api [POST] /Auth/change-password
  const res = await fetch("http://localhost:5000/api/Auth/change-password", {
    method: "POST",
    body: JSON.stringify(changePasswordData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData: ApiResponse<string> = await res.json();
  // console.log(responseData);
  const { data, success, message } = responseData;

  if (success) {
    return { success: true, errors: [] };
  } else {
    return { errors: [message] };
  }
};
