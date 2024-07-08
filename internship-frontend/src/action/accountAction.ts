"use server";

interface LoginFormData {
  accountName: string;
  password: string;
}

export const login = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState | undefined> => {
  //get value from formData
  const accountName = formData.get("accountName") as string;
  const password = formData.get("password") as string;
  const loginData: LoginFormData = { accountName, password };

  //declare errors
  const errors: string[] = [];

  //fetch api [POST] /account/login
  const res = await fetch("http://localhost:5000/api/Account/login", {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: { "Content-Type": "application/json" },
  });
  const responseData: ApiResponse<string> = await res.json();
  const { data, success, message } = responseData;

  //catch error
  if (!success) {
    errors.push(message);
  }
  if (errors.length > 0) {
    return { errors };
  }

  return { errors: [], success: true, data };
};
