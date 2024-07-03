"use client";

import { deleteAttributeValue } from "@/action/attributeValueAction";
import TagFiled from "@/components/ui/tag";
import { useCustomActionState } from "@/lib/custom/customHook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

interface IProps {
  productId: string;
  productValues: IProductValue[];
}

const ProductAttributeValueForm = ({ productId, productValues }: IProps) => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deleteAttributeValue,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !window.confirm(
        "Are you sure you want to delete this product attribute value?"
      )
    ) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Deleted product attribute value failed!");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Deleted product attribute value successfully!");
      router.push(`/dashboard/products/${productId}`);
    }
  }, [formState, toastDisplayed]);
  return (
    <>
      <div className="flex items-center justify-end mt-10">
        <Link
          href={{
            pathname: `/dashboard/product-values/add`,
            query: { productId },
          }}
        >
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Product Values
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Product Attribute</th>
            <th className="px-4 py-2">Value</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {productValues?.map((value: IProductValue, index) => (
            <tr
              key={value.productAttributeId}
              className="border-b border-gray-700"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{value.productAttribute.name}</td>
              <td className="px-4 py-2">{value.value}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={value.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={value.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link
                    href={{
                      pathname: `/dashboard/product-values/${value.productAttributeId}`,
                      query: { productId },
                    }}
                  >
                    <button className="m-1 px-5 py-2 bg-blue-600 text-white rounded">
                      Edit
                    </button>
                  </Link>

                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="productId" value={productId} />
                    <input
                      type="hidden"
                      name="productAttributeId"
                      value={value.productAttributeId}
                    />
                    <button className="m-1 px-5 py-2 bg-red-500 text-white rounded">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProductAttributeValueForm;
