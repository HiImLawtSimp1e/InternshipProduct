"use client";

import React, { useState } from "react";
import InputField from "@/components/ui/input";
import SelectField from "@/components/ui/select";
import { createUser } from "@/action/userAction";
import { useCustomActionState } from "@/lib/custom/customHook";

const AddUserForm = () => {
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    createUser,
    initialState
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    isAdmin: "false",
    isActive: "true",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <InputField
        label="Username"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <InputField
        label="Your email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputField
        label="Your password"
        id="password"
        name="password"
        type="password"
        value={formData.password}
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

      <SelectField
        label="Is Admin"
        id="isAdmin"
        name="isAdmin"
        value={formData.isAdmin}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
      />

      <SelectField
        label="Is Active"
        id="isActive"
        name="isActive"
        value={formData.isActive}
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
        Create
      </button>
    </form>
  );
};

export default AddUserForm;
