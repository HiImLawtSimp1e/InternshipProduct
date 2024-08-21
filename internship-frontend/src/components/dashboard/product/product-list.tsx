"use client";

import { deleteProduct } from "@/action/productAction";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import TagFiled from "@/components/ui/tag";
import { useCustomActionState } from "@/lib/custom/customHook";
import {
  formatDate,
  formatPrice,
  formatProductType,
} from "@/lib/format/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

interface IProps {
  products: IProduct[];
  pages: number;
  currentPage: number;
}

const ProductList = ({ products, pages, currentPage }: IProps) => {
  //using for pagination
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;

  //using for delete action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deleteProduct,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error("Deleted product failed!");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Deleted product successfully!");
      router.push("/dashboard/products");
    }
  }, [formState, toastDisplayed]);

  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search products..." />
        <Link href="/dashboard/products/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Product
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Slug</th>
            <th className="px-4 py-2">Variant</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Created By</th>
            <th className="px-4 py-2">Modified By</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: IProduct, index) => (
            <tr key={product.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{product.title}</td>
              <td className="px-4 py-2">{product.slug}</td>
              <td className="px-4 py-2">
                {product.productVariants.map(
                  (variant: IProductVariant, index) => (
                    <div key={index}>
                      {formatProductType(variant.productType.name)}
                    </div>
                  )
                )}
              </td>
              <td className="px-4 py-2">
                {product.productVariants.map(
                  (variant: IProductVariant, index) => (
                    <div key={index}>{formatPrice(variant.price)}</div>
                  )
                )}
              </td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={product.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={product.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">{formatDate(product.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(product.modifiedAt)}</td>
              <td className="px-4 py-2">{product.createdBy}</td>
              <td className="px-4 py-2">{product.modifiedBy}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={product.id} />
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
      <Pagination
        pages={pages}
        currentPage={currentPage}
        pageSize={pageSize}
        clsColor="gray"
      />
    </div>
  );
};
export default ProductList;
