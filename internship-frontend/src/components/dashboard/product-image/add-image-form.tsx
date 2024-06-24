"use client";

import { AddProductImage } from "@/action/productImageAction";
import SelectField from "@/components/ui/select";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddProductImageForm = ({ productId }: { productId: string }) => {
  const router = useRouter();

  // manage state of form action [useActionState hook]
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    AddProductImage,
    initialState
  );

  // manage state of form data
  const [formData, setFormData] = useState({
    isMain: "",
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
      toast.error("Create product image failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Created product image successfully!");
      router.push(`/dashboard/products/${productId}`);
    }
  }, [formState, toastDisplayed]);
  return (
    <form onSubmit={handleSubmit} className="px-4 w-full">
      <input type="hidden" name="productId" value={productId} />
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
      <SelectField
        label="Is Main"
        id="isMain"
        name="isMain"
        value={formData.isMain.toString()}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
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
export default AddProductImageForm;
