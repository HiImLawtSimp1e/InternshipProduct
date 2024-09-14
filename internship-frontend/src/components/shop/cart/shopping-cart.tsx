"use client";

import { formatPrice } from "@/lib/format/format";
import ShoppingCartItem from "./shopping-cart-item";
import { useVoucherStore } from "@/lib/store/useVoucherStore";
import ShoppingVoucher from "./shopping-voucher";
import ShoppingCartAddress from "./shoping-cart-address";
import Link from "next/link";

interface IProps {
  cartItems: ICartItem[];
  address: IAddress;
}

const ShoppingCart = ({ cartItems, address }: IProps) => {
  const { voucher } = useVoucherStore();

  let discount: number = 0;
  const totalAmount = cartItems.reduce(
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

  return (
    <div className="h-[150vh] bg-gray-100 pt-20">
      {cartItems?.length >= 1 && (
        <>
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
          <div className="mx-auto max-w-7xl justify-center px-6 lg:flex lg:space-x-6 xl:px-0">
            <div className="rounded-lg lg:w-2/3">
              {cartItems?.map((item: ICartItem) => (
                <ShoppingCartItem key={item.productTypeId} cartItem={item} />
              ))}
            </div>
            {/* Sub total */}
            <div className="flex flex-col gap-4 lg:mt-0 lg:w-1/3">
              <ShoppingCartAddress address={address} />
              <ShoppingVoucher />
              <div className="h-full rounded-lg border bg-white p-6 shadow-md ">
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700">Subtotal:</p>
                  <p className="text-gray-700">{formatPrice(totalAmount)}</p>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-gray-700">Discount:</p>
                    <p className="text-gray-700">{formatPrice(discount)}</p>
                  </div>
                )}
                <hr className="my-8" />
                <div className="flex justify-between">
                  <p className="text-lg font-bold">Total:</p>
                  <div className="">
                    <p className="mb-1 text-2xl font-bold">
                      {formatPrice(totalAmount - discount)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 text-right">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link href="/payment">
                  <button
                    type="submit"
                    className="mt-6 w-full rounded-md bg-blue-500 text-2xl py-4 font-medium text-blue-50 md:text-lg md:py-2 hover:bg-blue-600"
                  >
                    Check out
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      {cartItems?.length == 0 && (
        <h1 className="mb-10 text-center text-2xl font-bold">Empty Cart</h1>
      )}
    </div>
  );
};

export default ShoppingCart;
