import Pagination from "@/components/ui/pagination";
import { formatDate, formatPrice } from "@/lib/format/format";
import Link from "next/link";
import TagFiled from "@/components/ui/tag";
import { mapOrderState } from "@/lib/enums/OrderState";

interface IProps {
  orders: IOrder[];
  pages: number;
  currentPage: number;
}
const cssTagField: string[] = [
  "bg-yellow-300",
  "bg-blue-500",
  "bg-green-500",
  "bg-green-900",
  "bg-red-700",
];

const OrderList = ({ orders, pages, currentPage }: IProps) => {
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  return (
    <div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Invoice Code</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Discount Value</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order: IOrder, index) => (
            <tr key={order.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{order.invoiceCode}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={cssTagField[order.state]}
                  context={mapOrderState(order.state)}
                />
              </td>
              <td className="px-4 py-2">{formatPrice(order.discountValue)}</td>
              <td className="px-4 py-2">
                {formatPrice(order.totalPrice - order.discountValue)}
              </td>
              <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(order.modifiedAt)}</td>
              <td className="px-4 py-2">
                <Link href={`/dashboard/orders/${order.id}`}>
                  <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                    View
                  </button>
                </Link>
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

export default OrderList;
