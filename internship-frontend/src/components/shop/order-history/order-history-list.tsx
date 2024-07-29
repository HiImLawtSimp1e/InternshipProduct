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

const OrderHistoryList = ({ orders, pages, currentPage }: IProps) => {
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  return (
    <div className="mt-24 min-h-[100vh] overflow-x-auto">
      <table className="w-full text-left text-gray-600">
        <thead className="bg-gray-200 text-gray-600 border border-gray-300 font-bold uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Invoice Code</th>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">Order Date</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order: IOrder, index) => (
            <tr
              key={order.id}
              className="border-b bg-gray-100 hover:bg-blue-200"
            >
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{order.invoiceCode}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={cssTagField[order.state]}
                  context={mapOrderState(order.state)}
                />
              </td>
              <td className="px-4 py-2">{formatDate(order.createdAt)}</td>
              <td className="px-4 py-2">{formatPrice(order.totalPrice)}</td>
              <td className="px-4 py-2">
                <Link href={`/order-history/${order.id}`}>
                  <button className="m-1 px-5 py-2 bg-lime-600 text-white rounded">
                    Detail
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
        clsColor="blue"
      />
    </div>
  );
};

export default OrderHistoryList;
