"use client";

import { updateProductImage } from "@/action/productImageAction";
import SelectField from "@/components/ui/select";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

interface IProps {
  productId: string;
  productImage: IProductImage;
}

const UpdateProductImageForm = ({ productId, productImage }: IProps) => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updateProductImage,
    initialState
  );

  const [formData, setFormData] = useState<IProductImage>(productImage);

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

    // check if InputField
    if (e.target instanceof HTMLInputElement) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // check if SelectField
    if (e.target instanceof HTMLSelectElement) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Update product image failed");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Updated product image successfully!");
      router.push(`/dashboard/products/${productId}`);
    }
  }, [formState, toastDisplayed]);
  return (
    <div className="container mt-5">
      <div className="flex gap-8">
        <div className="basis-1/4 bg-gray-700 p-4 rounded-lg font-bold">
          <div className="w-full h-72 relative rounded-lg overflow-hidden mb-4">
            <Image
              src={productImage.imageUrl?.toString() || "/product.png"}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="basis-3/4 bg-gray-700 p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 w-full">
            <input type="hidden" name="id" value={productImage.id} />
            <input type="hidden" name="productId" value={productId} />
            <input
              type="hidden"
              name="imageUrl"
              value={productImage.imageUrl}
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
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdateProductImageForm;
