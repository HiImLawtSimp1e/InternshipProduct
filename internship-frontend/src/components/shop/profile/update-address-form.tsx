"use client";

import { updateAddress } from "@/action/profileAction";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  address: IAddress;
}

const UpdateAddressForm = ({ address }: IProps) => {
  const router = useRouter();

  // manage state of form action [useActionState hook]
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updateAddress,
    initialState
  );

  const [formData, setFormData] = useState<IAddress>(address);

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Updated address failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Updated address successfully!");
      router.push("/profile");
    }
  }, [formState, toastDisplayed]);
  return (
    <div className="flex justify-center mt-20 px-8">
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="flex flex-wrap border shadow rounded-lg p-3 ">
          <div className="flex flex-col gap-2 w-full border-gray-400">
            <input type="hidden" name="id" value={address.id} />
            <div>
              <label
                className="text-gray-600 dark:text-gray-400"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow "
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="text-gray-600 dark:text-gray-400"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow "
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="text-gray-600 dark:text-gray-400"
                htmlFor="phone"
              >
                Phone Number
              </label>
              <input
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow "
                id="phone"
                name="phone"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                className="text-gray-600 dark:text-gray-400"
                htmlFor="address"
              >
                Address
              </label>
              <input
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow "
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="isMain"
                className="text-gray-600 dark:text-gray-400"
              >
                Is Main
              </label>
              <select
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow "
                id="isMain"
                name="isMain"
                value={formData.isMain.toString()}
                onChange={handleChange}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>

            {formState.errors.length > 0 && (
              <ul>
                {formState.errors.map((error, index) => {
                  return (
                    <li className="text-red-400" key={index}>
                      {error}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex justify-end">
              <button
                className="py-1.5 px-3 m-1 text-center bg-violet-700 border rounded-md text-white hover:bg-violet-500 hover:text-gray-100"
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateAddressForm;
