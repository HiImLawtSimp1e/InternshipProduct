"use client";

import { addProduct } from "@/action/productAction";
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  categorySelect: ICategorySelect[];
  typeSelect: IProductType[];
}

const AddProductForm = ({ categorySelect, typeSelect }: IProps) => {
  const router = useRouter();

  // manage state of form action [useActionState hook]
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addProduct,
    initialState
  );

  // manage state of form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    seoKeyworks: "",
    categoryId: "",
    productTypeId: "",
    price: "",
    originalPrice: "",
  });

  const [toastDisplayed, setToastDisplayed] = useState(false);

  //handle submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  //handle change
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
      toast.error("Create product failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Created product successfully!");
      router.push("/dashboard/products");
    }
  }, [formState, toastDisplayed]);

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
      <label className="block mb-2 text-sm font-medium" htmlFor="image">
        Image
      </label>
      <input
        id="image"
        name="image"
        type="file"
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600  border border-gray-600 cursor-pointer focus:outline-none placeholder-gray-400"
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
      <label className="block mb-2 text-sm font-medium text-white">
        Category
      </label>
      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
      >
        {categorySelect?.map((category: ICategorySelect, index) => (
          <option key={index} value={category.id}>
            {category.title}
          </option>
        ))}
      </select>
      <label className="block mb-2 text-sm font-medium text-white">
        Product Type
      </label>
      <select
        name="productTypeId"
        value={formData.productTypeId}
        onChange={handleChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
      >
        {typeSelect?.map((type: IProductType, index) => (
          <option key={index} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <InputField
        type="number"
        label="Price"
        id="price"
        name="price"
        value={formData.price.toString()}
        onChange={handleChange}
        min-value={0}
        required
      />
      <InputField
        type="number"
        label="Original Price"
        id="originalPrice"
        name="originalPrice"
        value={formData.originalPrice.toString()}
        onChange={handleChange}
        min-value={0}
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
          {formState.errors.map((error, index) => {
            return (
              <li className="text-red-400" key={index}>
                {error}
              </li>
            );
          })}
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
