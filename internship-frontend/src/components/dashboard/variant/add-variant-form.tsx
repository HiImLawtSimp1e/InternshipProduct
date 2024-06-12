"use client";

import { addVariant } from "@/action/variantAction";
// Import necessary modules and interfaces
import InputField from "@/components/ui/input";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useState } from "react";

interface IProps {
  productId: string;
  typeSelect: IProductType[];
}

const AddVariantForm = ({ productId, typeSelect }: IProps) => {
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addVariant,
    initialState
  );

  const [formData, setFormData] = useState({
    productTypeId: "",
    price: "",
    originalPrice: "",
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
      <input type="hidden" name="productId" value={productId} />
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
        required
      />
      <select
        name="productTypeId"
        onChange={handleChange}
        className="text-sm rounded-lg w-full p-2.5 bg-gray-600 placeholder-gray-400 text-white"
      >
        {typeSelect.map((type: IProductType, index) => (
          <option key={index} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="float-right mt-4 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
      >
        Create Variant
      </button>
      {formState.errors.length > 0 && (
        <ul>
          {formState.errors.map((error, index) => (
            <li className="text-red-400" key={index}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default AddVariantForm;
