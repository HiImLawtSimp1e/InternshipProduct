"use client";

import { adminLoginAction } from "@/action/accountAction";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setAuthPublic } from "@/services/auth-service/auth-service";

const AdminLoginForm = () => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    adminLoginAction,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Login failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      setAuthPublic(formState.data?.toString() || "");
      router.push("/dashboard");
    }
  }, [formState, toastDisplayed]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-10 rounded-xl w-96 h-96 flex flex-col items-center justify-center space-y-8"
    >
      <h1 className="text-2xl font-bold">Admin</h1>
      <input
        type="text"
        placeholder="username"
        name="accountName"
        className="w-full text-zinc-950 px-4 py-3 border-2 border-gray-400 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500"
        required
      />
      <input
        type="password"
        placeholder="password"
        name="password"
        className="w-full text-zinc-950 px-4 py-3 border-2 border-gray-400 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500"
        required
      />
      {formState.errors.length > 0 && (
        <ul>
          {formState.errors.map((error, index) => (
            <li className="text-red-400" key={index}>
              {error}
            </li>
          ))}
        </ul>
      )}
      <button
        type="submit"
        className="w-full px-4 py-3 bg-teal-500 text-white font-bold rounded-lg"
      >
        Login
      </button>
    </form>
  );
};
export default AdminLoginForm;
