"use client";

import React, { useEffect, useState } from "react";
import InputField from "@/components/ui/input";
import { createUser } from "@/action/userAction";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface IProps {
  roleSelect: IRole[];
}

const AddUserForm = ({ roleSelect }: IProps) => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    createUser,
    initialState
  );

  const [formData, setFormData] = useState({
    accountName: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    roleId: "",
  });

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
      toast.error("Create user failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Created user successfully!");
      router.push("/dashboard/users");
    }
  }, [formState, toastDisplayed]);

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <InputField
        label="Username"
        id="accountName"
        name="accountName"
        value={formData.accountName}
        onChange={handleChange}
        required
      />
      <InputField
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputField
        label="Password"
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <InputField
        label="Full Name"
        id="fullName"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />
      <InputField
        label="Phone number"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <InputField
        label="Address"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <label className="block mb-2 text-sm font-medium text-white">Role</label>
      <select
        name="roleId"
        value={formData.roleId}
        onChange={handleChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
      >
        {roleSelect?.map((role: IRole, index) => (
          <option key={index} value={role.id}>
            {role.roleName}
          </option>
        ))}
      </select>
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
        Create
      </button>
    </form>
  );
};

export default AddUserForm;
