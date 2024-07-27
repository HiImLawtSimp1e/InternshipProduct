import { formatDate, formatPrice } from "@/lib/format/format";
import Image from "next/image";

interface IProps {
  orderItems: IOrderItem[];
  orderCustomer: IOrderCustomer;
}

const OrderHistoryDetail = ({ orderItems, orderCustomer }: IProps) => {
  const totalAmount = orderItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );
  const cssTagField: string[] = [
    "bg-yellow-300",
    "bg-blue-500",
    "bg-green-500",
    "bg-green-900",
    "bg-red-700",
  ];
  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Invoice Code {orderCustomer.invoiceCode}
        </h1>
        <p className="text-base font-medium leading-6 text-gray-600">
          {formatDate(orderCustomer.orderCreatedAt)}
        </p>
      </div>
      <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start  w-full space-y-4 md:space-y-6 xl:space-y-8">
          <div className="flex flex-col justify-start items-start bg-gray-50 rounded-md shadow-lg px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
            <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
              Products
            </p>
            {orderItems?.map((item, index) => (
              <div
                key={index}
                className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
              >
                <div className="my-4 relative w-full md:h-32 md:w-40 opacity-70">
                  <Image
                    className="w-full hidden md:block"
                    src={item.imageUrl}
                    alt=""
                    fill
                  />
                </div>
                <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                  <div className="w-full flex flex-col justify-start items-start space-y-8">
                    <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                      {item.productTitle}
                    </h3>
                    <div className="flex justify-start items-start flex-col space-y-2">
                      <p className="text-sm leading-none text-gray-800">
                        <span className="text-gray-400">
                          {item.productTypeName}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between space-x-8 items-start w-full">
                    <p className="text-base xl:text-lg leading-6">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-base xl:text-lg leading-6 text-gray-400">
                      x{item.quantity}
                    </p>
                    <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col bg-gray-50 p-6 justify-start items-start rounded-md shadow-lg w-full space-y-4 xl:p-8 md:space-y-6 xl:space-y-8">
            <h3 className="text-xl my-4 font-semibold leading-5 text-gray-800">
              Customer
            </h3>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Full Name
              </p>
              <p className="text-sm leading-5 text-gray-600">
                {orderCustomer.fullName}
              </p>
            </div>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Phone
              </p>
              <p className="text-sm leading-5 text-gray-600">
                {orderCustomer.phone}
              </p>
            </div>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Email
              </p>
              <p className="text-sm  leading-5 text-gray-600">
                {orderCustomer.email}
              </p>
            </div>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Address
              </p>
              <p className="text-sm  leading-5 text-gray-600">
                {orderCustomer.address}
              </p>
            </div>
          </div>
          <div className="mt-12 flex justify-center md:flex-row flex-col items-stretch rounded-md shadow-lg w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6">
              <h3 className="text-xl font-semibold leading-5 text-gray-800">
                Summary
              </h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between w-full">
                  <p className="text-base leading-4 text-gray-800">Subtotal</p>
                  <p className="text-base leading-4 text-gray-600">
                    {formatPrice(totalAmount)}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base leading-4 text-gray-800">Discount</p>
                  <p className="text-base leading-4 text-gray-600">
                    -{formatPrice(totalAmount / 2)} (50%)
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base leading-4 text-gray-800">Shipping</p>
                  <p className="text-base leading-4 text-gray-600">
                    {formatPrice(30000)}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base font-semibold leading-4 text-gray-800">
                  Total
                </p>
                <p className="text-base font-semibold leading-4 text-gray-600">
                  {formatPrice(totalAmount / 2 + 30000)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDetail;
