import { formatPrice } from "@/lib/format/format";

interface IProps {
  orderItems: IOrderItem[];
}

const OrderDetail = ({ orderItems }: IProps) => {
  const totalAmount = orderItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  return (
    <>
      <div>
        <table className="w-full text-left text-gray-400">
          <thead className="bg-gray-700 text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Product Type</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems?.map((item: IOrderItem, index) => (
              <tr
                key={item.productTypeId}
                className="border-b border-gray-700 "
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.productTitle}</td>
                <td className="px-4 py-2">{item.productTypeName}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{formatPrice(item.price)}</td>
                <td className="px-4 py-2">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end text-xl text-white py-4 gap-4">
          <div className=" font-bold uppercase ">Total Amount:</div>
          <div className=" font-semibold">{formatPrice(totalAmount)}</div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
