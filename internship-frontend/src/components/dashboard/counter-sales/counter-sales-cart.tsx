"use client";

import { useCounterSaleStore } from "@/lib/store/useCounterSaleStore";
import CounterSalesOrderItem from "./counter-sales-order-item";
import { formatPrice } from "@/lib/format/format";
import { useVoucherStore } from "@/lib/store/useVoucherStore";

const CounterSaleCart = () => {
  const { orderItems } = useCounterSaleStore();
  const { voucher } = useVoucherStore();

  let discount: number = 0;
  const totalAmount = orderItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  if (voucher != null) {
    if (totalAmount > voucher.minOrderCondition) {
      if (voucher.isDiscountPercent) {
        const estimateValue = totalAmount * (voucher.discountValue / 100);
        discount =
          estimateValue > voucher.maxDiscountValue
            ? voucher.maxDiscountValue
            : estimateValue;
      } else {
        discount = voucher.discountValue;
      }
    }
  }

  const handleSubmit = (orderItems: IOrderItem[]) => {};

  return (
    <div className="h-[150vh] pt-20">
      {orderItems?.length >= 1 && (
        <>
          <div className="flex flex-col gap-1">
            {orderItems?.map((item: IOrderItem, index: number) => (
              <CounterSalesOrderItem key={index} item={item} />
            ))}
            <div className="mt-6 h-full rounded-lg border p-6 shadow-md text-gray-100">
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
              {/* <CounterSaleVoucher /> */}
            </div>
          </div>
        </>
      )}
      {orderItems?.length == 0 && (
        <h1 className="mb-10 text-center text-gray-600 text-2xl font-bold opacity-80">
          Empty Cart
        </h1>
      )}
    </div>
  );
};

export default CounterSaleCart;
