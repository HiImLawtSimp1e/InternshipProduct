import { formatPrice, formatDate } from "@/lib/format/format";

interface IProps {
  orderDetail: IOrderDetail;
  orderItems: IOrderItem[];
}

const OrderDetail = ({ orderDetail, orderItems }: IProps) => {
  const totalAmount = orderItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  const isWalkinCustomer = (orderDetail: IOrderDetail) => {
    return (
      orderDetail.fullName === "" &&
      orderDetail.email === "" &&
      orderDetail.address === "" &&
      orderDetail.phone === ""
    );
  };

  return (
    <>
      <div className="shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <div className="text-2xl mb-2 font-bold text-white uppercase">
            Invoice Code #{orderDetail.invoiceCode}
          </div>
          <div className="mb-2 ml-auto text-lg text-gray-400">
            Order Date: {formatDate(orderDetail.orderCreatedAt)}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          {!isWalkinCustomer(orderDetail) ? (
            <>
              <div className="text-2xl mb-2 font-bold text-white uppercase">
                Bill to
              </div>
              <address className="my-6 text-lg flex flex-col gap-2 text-gray-400">
                <p>Customer: {orderDetail.fullName}</p>
                <p>Email: {orderDetail.email}</p>
                <p>Address: {orderDetail.address}</p>
                <p>Phone: {orderDetail.phone}</p>
              </address>
            </>
          ) : (
            <p>Walk-in Customer</p>
          )}
        </div>
      </div>
      <div>
        <table className="w-full text-left text-gray-400">
          <thead className="bg-gray-700 text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Product Type</th>
              <th className="px-4 py-2">Original Price</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
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
                <td className="px-4 py-2">
                  {item.originalPrice > item.price
                    ? formatPrice(item.originalPrice)
                    : formatPrice(item.price)}
                </td>
                <td className="px-4 py-2">{formatPrice(item.price)}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col mt-8 gap-1">
          {orderDetail.discountValue > 0 && (
            <>
              <div className="flex justify-end text-xl text-white gap-4">
                <div className="">Subtotal:</div>
                <div className=" font-semibold">{formatPrice(totalAmount)}</div>
              </div>
              <div className="flex justify-end text-xl text-white gap-4">
                <div className="">Discount:</div>
                <div className=" font-semibold">
                  {formatPrice(orderDetail.discountValue)}
                </div>
              </div>
            </>
          )}
          <div className="flex justify-end text-xl text-white gap-4">
            <div className="">Total Amount:</div>
            <div className=" font-semibold">
              {formatPrice(totalAmount - orderDetail.discountValue)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
