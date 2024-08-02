"use client";

import { deleteVoucher } from "@/action/voucherAction";
import Pagination from "@/components/ui/pagination";
import Search from "@/components/ui/search";
import TagFiled from "@/components/ui/tag";
import { useCustomActionState } from "@/lib/custom/customHook";
import { formatDate, formatPrice } from "@/lib/format/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

interface IProps {
  vouchers: IAdminVoucher[];
  pages: number;
  currentPage: number;
}

const VoucherList = ({ vouchers, pages, currentPage }: IProps) => {
  //using for pagination
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;

  //using for delete action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    deleteVoucher,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to delete this voucher?")) {
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
      toast.success("Deleted voucher successfully!");
      router.push("/dashboard/vouchers");
    }
  }, [formState, toastDisplayed]);

  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search vouchers..." />
        <Link href="/dashboard/vouchers/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Vouchers
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400 overflow-x-auto">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Discount Code</th>
            <th className="px-4 py-2">Voucher Name</th>
            <th className="px-4 py-2">Discount Type</th>
            <th className="px-4 py-2">Discount Value</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher: IAdminVoucher, index) => (
            <tr key={voucher.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{voucher.code}</td>
              <td className="px-4 py-2">{voucher.voucherName}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={
                    voucher.isDiscountPercent ? "bg-green-700" : "bg-blue-900"
                  }
                  context={voucher.isDiscountPercent ? "Percent" : "Fixed"}
                />
              </td>
              <td className="px-4 py-2">
                {voucher.isDiscountPercent
                  ? `${voucher.discountValue}%`
                  : formatPrice(voucher.discountValue)}
              </td>
              <td className="px-4 py-2">{formatDate(voucher.startDate)}</td>
              <td className="px-4 py-2">{formatDate(voucher.endDate)}</td>
              <td className="px-4 py-2">{formatDate(voucher.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(voucher.modifiedAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/vouchers/${voucher.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={voucher.id} />
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

export default VoucherList;
