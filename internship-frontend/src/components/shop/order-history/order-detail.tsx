"use client";

import { cancelOrder } from "@/action/orderAction";
import { useCustomActionState } from "@/lib/custom/customHook";
import { formatDate, formatPrice } from "@/lib/format/format";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  orderItems: IOrderItem[];
  orderDetail: IOrderDetail;
}

const OrderHistoryDetail = ({ orderItems, orderDetail }: IProps) => {
  const totalAmount = orderItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    cancelOrder,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error(formState.errors[0] || "Canceled order failed!");
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Canceled order successfully!");
      router.push("/order-history");
    }
  }, [formState, toastDisplayed]);
  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Invoice Code {orderDetail.invoiceCode}
        </h1>
        <p className="text-base font-medium leading-6 text-gray-400">
          Order Created At:{" "}
          <span className="text-gray-800">
            {formatDate(orderDetail.orderCreatedAt)}
          </span>
        </p>
        <p className="text-base font-medium leading-6 text-gray-400">
          Payment method:{" "}
          <span className="text-gray-800">{orderDetail.paymentMethodName}</span>
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
                    src={item?.imageUrl || "/product.png"}
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
                      {item.originalPrice > item.price ? (
                        <>
                          {formatPrice(item.price)}
                          <span className="text-red-300 line-through">
                            {" "}
                            {formatPrice(item.originalPrice)}
                          </span>
                        </>
                      ) : (
                        formatPrice(item.price)
                      )}
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
        <div className="flex flex-col w-full gap-12">
          <div className="flex flex-col bg-gray-50 p-6 justify-start items-start rounded-md shadow-lg w-full space-y-4 xl:p-8 md:space-y-6 xl:space-y-8">
            <h3 className="text-xl my-4 font-semibold leading-5 text-gray-800">
              Customer
            </h3>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Full Name
              </p>
              <p className="text-sm leading-5 text-gray-600">
                {orderDetail.fullName}
              </p>
            </div>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Phone
              </p>
              <p className="text-sm leading-5 text-gray-600">
                {orderDetail.phone}
              </p>
            </div>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Email
              </p>
              <p className="text-sm  leading-5 text-gray-600">
                {orderDetail.email}
              </p>
            </div>
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-base  font-semibold leading-4 text-gray-800">
                Address
              </p>
              <p className="text-sm  leading-5 text-gray-600">
                {orderDetail.address}
              </p>
            </div>
          </div>
          <div className="flex justify-center md:flex-row flex-col items-stretch rounded-md shadow-lg w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
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
                {orderDetail.discountValue > 0 && (
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base leading-4 text-gray-800">
                      Discount
                    </p>
                    <p className="text-base leading-4 text-gray-600">
                      -{formatPrice(orderDetail.discountValue)}
                    </p>
                  </div>
                )}
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
                  {formatPrice(totalAmount - orderDetail.discountValue + 30000)}
                </p>
              </div>
            </div>
          </div>
          {orderDetail.state !== 3 && orderDetail.state !== 4 && (
            <div className="flex justify-end items-center w-full">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="orderId" value={orderDetail.id} />
                <button
                  type="submit"
                  className="m-1 px-5 py-2 bg-yellow-500 text-white rounded"
                >
                  Cancel Order
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDetail;
