"use client";

import { addProduct } from "@/action/productAction";
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useState } from "react";

const AddProductForm = () => {
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addProduct,
    initialState
  );

  // Sửa đổi useState để sử dụng kiểu dữ liệu IProduct
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeyworks: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
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

  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <InputField
        label="Title"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <InputField
        label="Description"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <InputField
        label="Image URL"
        id="imageUrl"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        required
      />
      <InputField
        label="SEO Title"
        id="seoTitle"
        name="seoTitle"
        value={formData.seoTitle}
        onChange={handleChange}
        required
      />
      <InputField
        label="SEO Description"
        id="seoDescription"
        name="seoDescription"
        value={formData.seoDescription}
        onChange={handleChange}
        required
      />
      <InputField
        label="SEO Keywords"
        id="seoKeyworks"
        name="seoKeyworks"
        value={formData.seoKeyworks}
        onChange={handleChange}
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
        className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Create
      </button>
    </form>
  );
};

export default AddProductForm;
