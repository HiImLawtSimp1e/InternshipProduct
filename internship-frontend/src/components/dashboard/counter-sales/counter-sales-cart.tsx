"use client";

import { useCounterSaleStore } from "@/lib/store/useCounterSaleStore";
import CounterSalesOrderItem from "./counter-sales-order-item";
import { formatPrice } from "@/lib/format/format";
import { useVoucherStore } from "@/lib/store/useVoucherStore";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/ui/loading";

const CounterSaleCart = () => {
  const { orderItems } = useCounterSaleStore();
  const { voucher } = useVoucherStore();

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

  const handleSubmit = (orderItems: IOrderItem[]) => {
    // Handle submit logic
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-[150vh]">
      <div className="flex flex-col gap-4">
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
              <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  handleSubmit(orderItems);
                }}
              >
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md bg-blue-500 text-2xl py-4 font-medium text-blue-50 md:text-lg md:py-2 hover:bg-blue-600"
                >
                  Check out
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
