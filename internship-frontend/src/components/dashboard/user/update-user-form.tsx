"use client";

import React, { useEffect, useState } from "react";
import InputField from "@/components/ui/input";
import SelectField from "@/components/ui/select";
import { useCustomActionState } from "@/lib/custom/customHook";
import { updateUser } from "@/action/userAction";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface IProps {
  user: IUser;
}

const UpdateUserForm = ({ user }: IProps) => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updateUser,
    initialState
  );

  const [formData, setFormData] = useState<IUser>(user);

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
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Updated user failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Updated user successfully!");
      router.push("/dashboard/users");
    }
  }, [formState, toastDisplayed]);

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <input type="hidden" name="id" value={user.id} />
      <label className="block mb-2 text-sm font-medium text-white">
        Account Name
      </label>
      <input
        value={formData.accountName}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
        readOnly
      />
      <label className="block mb-2 text-sm font-medium text-white">Role</label>
      <input
        value={formData.role.roleName}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
        readOnly
      />
      <InputField
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email?.toString() || ""}
        onChange={handleChange}
        required
      />
      <InputField
        label="Full Name"
        id="fullName"
        name="fullName"
        value={formData.fullName?.toString() || ""}
        onChange={handleChange}
        required
      />
      <InputField
        label="Phone number"
        id="phone"
        name="phone"
        value={formData.phone?.toString() || ""}
        onChange={handleChange}
        required
      />
      <InputField
        label="Address"
        id="address"
        name="address"
        value={formData.address?.toString() || ""}
        onChange={handleChange}
        required
      />
      <SelectField
        label="Is Active"
        id="isActive"
        name="isActive"
        value={formData.isActive.toString()}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
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
        className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Update
      </button>
    </form>
  );
};

export default UpdateUserForm;
