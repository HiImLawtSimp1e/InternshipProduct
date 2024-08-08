"use client";

import { deleteAddress } from "@/action/profileAction";
import Pagination from "@/components/ui/pagination";
import TagFiled from "@/components/ui/tag";
import { useCustomActionState } from "@/lib/custom/customHook";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

interface IProps {
  addresses: IAddress[];
  pages: number;
  currentPage: number;
  pageSize?: number;
}

const UserProfile = ({ addresses, pages, currentPage, pageSize }: IProps) => {
  //using for delete action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deleteAddress,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error(formState.errors[0] || "Deleted address failed!");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Deleted address successfully!");
      router.push("/profile");
    }
  }, [formState, toastDisplayed]);

  return (
    <div className="mt-12 py-3 px-2 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="flex items-center justify-end mb-5">
        <Link href="/profile/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Address
          </button>
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {addresses.map((address: IAddress, index: number) => (
          <div
            key={index}
            className="w-full flex flex-col gap-4 lg:w-[45%] xl:w-[30%] pb-2 shadow rounded-lg border"
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between">
              <TagFiled
                cssClass={`text-white ${
                  address.isMain ? "bg-blue-600" : "bg-pink-700"
                }`}
                context={address.isMain ? "Active" : "Passive"}
              />
              <Link
                href={`/profile/${address.id}`}
                className="text-lg leading-6 font-medium text-blue-600"
              >
                Edit
              </Link>
            </div>
            <div
              className={`border-t border-gray-200 px-4 py-5 sm:p-0 min-h-[280px] ${
                address.isMain ? "" : "opacity-40"
              }`}
            >
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {address.fullName}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {address.email}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {address.phone}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {address.address}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex items-center justify-end">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={address.id} />
                <button
                  type="submit"
                  className="mx-4 p-2 mb-5 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        pageSize={pageSize}
        clsColor="blue"
      />
    </div>
  );
};

export default UserProfile;
