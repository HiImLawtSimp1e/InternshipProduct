"use client";

import Link from "next/link";
import Image from "next/image";
import { MdAdd } from "react-icons/md";
import TagFiled from "@/components/ui/tag";
import { useRouter } from "next/navigation";
import { useCustomActionState } from "@/lib/custom/customHook";
import { deleteProductImage } from "@/action/productImageAction";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  productId: string;
  images: IProductImage[];
}

const ProductImageForm = ({ productId, images }: IProps) => {
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deleteProductImage,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !window.confirm("Are you sure you want to delete this product image?")
    ) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error(formState.errors[0]);
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Deleted product images successfully!");
      router.push(`/dashboard/products/${productId}`);
    }
  }, [formState, toastDisplayed]);
  return (
    <>
      <div className="flex items-center justify-end mt-10">
        <Link
          href={{
            pathname: `/dashboard/product-images/add`,
            query: { productId },
          }}
        >
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Image
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Main</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image: IProductImage, index) => (
            <tr key={image.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={image.imageUrl?.toString() || "/product.png"}
                    alt=""
                    width={60}
                    height={60}
                  />
                </div>
              </td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={image.isMain ? "bg-blue-900" : "bg-gray-700"}
                  context={image.isMain ? "Main" : "Sub"}
                />
              </td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={image.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={image.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link
                    href={{
                      pathname: `/dashboard/product-images/${image.id}`,
                      query: { productId },
                    }}
                  >
                    <button className="m-1 px-5 py-2 bg-blue-600 text-white rounded">
                      Edit
                    </button>
                  </Link>

                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={image.id} />
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

export default ProductImageForm;
