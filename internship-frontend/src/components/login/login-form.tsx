"use client";

import { login } from "@/action/accountAction";
import { useCustomActionState } from "@/lib/custom/customHook";

const LoginForm = () => {
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    login,
    initialState
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-10 rounded-xl w-96 h-96 flex flex-col items-center justify-center space-y-8"
    >
      <h1 className="text-2xl font-bold">Login</h1>
      <input
        type="text"
        placeholder="username"
        name="accountName"
        className="w-full text-zinc-950 px-4 py-3 border-2 border-gray-400 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500"
      />
      <input
        type="password"
        placeholder="password"
        name="password"
        className="w-full text-zinc-950 px-4 py-3 border-2 border-gray-400 rounded-lg bg-gray-100 focus:outline-none focus:border-blue-500"
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
export default LoginForm;
