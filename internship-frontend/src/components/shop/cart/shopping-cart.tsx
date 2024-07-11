"use client";

import { formatPrice } from "@/lib/format/format";
import ShoppingCartItem from "./shopping-cart-item";
import { useState } from "react";
import { placeOrder } from "@/action/orderAction";

interface IProps {
  cartItems: ICartItem[];
}

const ShoppingCart = ({ cartItems }: IProps) => {
  const totalAmount = cartItems.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  return (
    <div className="h-screen bg-gray-100 pt-20">
      {cartItems?.length >= 1 && (
        <>
          <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
          <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3">
              {cartItems?.map((item: ICartItem) => (
                <ShoppingCartItem key={item.productTypeId} cartItem={item} />
              ))}
            </div>
            {/* Sub total */}
            <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-700">{formatPrice(totalAmount)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">{formatPrice(30000)}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Total</p>
                <div className="">
                  <p className="mb-1 text-lg font-bold">
                    {formatPrice(totalAmount + 30000)}
                  </p>
                  <p className="text-sm text-gray-700">including VAT</p>
                </div>
              </div>
              <form action={placeOrder}>
                <button
                  type="submit"
                  className="mt-6 w-full rounded-md bg-blue-500 text-2xl py-4 font-medium text-blue-50 md:text-lg md:py-2 hover:bg-blue-600"
                >
                  Check out
                </button>
              </form>
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
