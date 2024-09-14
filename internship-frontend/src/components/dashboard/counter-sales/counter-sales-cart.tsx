"use client";

import { useCounterSaleStore } from "@/lib/store/useCounterSaleStore";
import CounterSalesOrderItem from "./counter-sales-order-item";
import { formatPrice } from "@/lib/format/format";
import { useVoucherStore } from "@/lib/store/useVoucherStore";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/ui/loading";
import { useSearchAddressStore } from "@/lib/store/useSearchAddressStore";
import { getAuthPublic } from "@/services/auth-service/auth-service";
import { toast } from "react-toastify";
import PaymentMethodSelect from "./payment-method-select";

interface IOrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  orderItems: IOrderItem[];
  paymentMethodId: string;
}

const CounterSaleCart = () => {
  const { orderItems } = useCounterSaleStore();
  const { address } = useSearchAddressStore();
  const { voucher } = useVoucherStore();
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const totalAmount = orderItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  let discount: number = 0;
  if (voucher && totalAmount > voucher.minOrderCondition) {
    discount = voucher.isDiscountPercent
      ? Math.min(
          totalAmount * (voucher.discountValue / 100),
          voucher.maxDiscountValue
        )
      : voucher.discountValue;
  }

  // Hàm tạo đơn hàng
  const createOrder = async (): Promise<FormState | undefined> => {
    const authToken = getAuthPublic();
    if (!authToken) {
      return { errors: ["You need to log in"] };
    }

    setIsLoading(true);

    if (address === null) {
      setIsLoading(false);
      return { errors: ["Customer information is required"] };
    }

    if (paymentMethodId === null || paymentMethodId === "") {
      setIsLoading(false);
      return { errors: ["Payment method is required"] };
    }

    try {
      const orderData: IOrderFormData = {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        address: address.address,
        orderItems: orderItems,
        paymentMethodId: paymentMethodId,
      };

      const res = await fetch(
        `http://localhost:5000/api/OrderCounter/place-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
      //console.log(res);

      const responseData: ApiResponse<boolean> = await res.json();

      //console.log(responseData);

      const { success, message } = responseData;

      if (success) {
        // If the response is success and success is true
        sessionStorage.removeItem("orderItems");
        sessionStorage.removeItem("orderAddress");
        setIsLoading(false);
        return { success: true, errors: [] };
      } else {
        setIsLoading(false);
        return { errors: [message] };
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (address === null) {
      toast.error("Customer information is required");
      return;
    }

    try {
      const result = await createOrder();

      if (result?.success) {
        toast.success("Create new order successfully");
        if (typeof window !== "undefined") {
          window.location.reload(); // Reload the page to clear the form or update the UI
        }
      } else {
        // Nếu không thành công, hiện thông báo lỗi
        const errorMessage = result?.errors?.[0] || "Failed to create order";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while creating the order.");
    }
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-[150vh]">
      <div className="flex flex-col gap-4">
        <PaymentMethodSelect
          value={paymentMethodId}
          onChange={(id) => setPaymentMethodId(id)}
        />
        {orderItems.length > 0 ? (
          <>
            <div className="p-5 flex flex-col gap-1 rounded-lg bg-gray-600">
              {isClient ? (
                orderItems.map((item: IOrderItem, index: number) => (
                  <Suspense key={index} fallback={<Loading />}>
                    <CounterSalesOrderItem item={item} />
                  </Suspense>
                ))
              ) : (
                <Loading />
              )}
            </div>

            <div className="h-full p-6 shadow-md text-gray-100 rounded-lg bg-gray-600">
              <div className="mb-2 flex justify-between">
                <p>Subtotal:</p>
                <p>{formatPrice(totalAmount)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <p>Discount:</p>
                  <p>{formatPrice(discount)}</p>
                </div>
              )}
              <hr className="my-8" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Total:</p>
                <div className="">
                  <p className="mb-1 text-2xl font-bold">
                    {formatPrice(totalAmount - discount)}
                  </p>
                  <p className="text-sm text-gray-300">including VAT</p>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md bg-blue-500 text-2xl py-4 font-medium text-blue-50 md:text-lg md:py-2 hover:bg-blue-600"
                >
                  {isLoading ? "Loading..." : "Create Order"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <h1 className="mb-10 text-center text-gray-600 text-2xl font-bold opacity-80">
            Empty Cart
          </h1>
        )}
      </div>
    </div>
  );
};

export default CounterSaleCart;
