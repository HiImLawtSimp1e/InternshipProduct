"use client";

import { MdAdd } from "react-icons/md";
import { formatDate } from "@/lib/format/format";
import Link from "next/link";
import { deleteType } from "@/action/productTypeAction";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  productTypes: IProductType[];
  pages: number;
  currentPage: number;
}

const ProductTypeList = ({ productTypes, pages, currentPage }: IProps) => {
  //using for pagination
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;

  //using for delete action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deleteType,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this product type?")) {
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
      toast.success("Deleted product type successfully!");
      router.push("/dashboard/product-types");
    }
  }, [formState, toastDisplayed]);

  return (
    <div>
      <div className="flex items-center justify-end mb-5">
        <Link href="/dashboard/product-types/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Type
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((type: IProductType, index) => (
            <tr key={type.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{type.name}</td>
              <td className="px-4 py-2">{formatDate(type.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(type.modifiedAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/product-types/${type.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={type.id} />
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

export default ProductTypeList;
