"use client";

import { addProduct } from "@/action/productAction";
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useState } from "react";

interface IProps {
  categorySelect: ICategorySelect[];
}

const AddProductForm = ({ categorySelect }: IProps) => {
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addProduct,
    initialState
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    seoTitle: "",
    seoDescription: "",
    seoKeyworks: "",
    categoryId: "",
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
      | React.ChangeEvent<HTMLTextAreaElement>
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
      <label
        htmlFor="description"
        className="block mb-2 text-sm font-medium text-white"
      >
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        rows={10}
        onChange={handleChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
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
      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
      >
        {categorySelect.map((category: ICategorySelect, index) => (
          <option key={index} value={category.id}>
            {category.title}
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

export default AddProductForm;
