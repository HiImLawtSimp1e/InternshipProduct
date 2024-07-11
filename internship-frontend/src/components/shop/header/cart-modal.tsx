"use client";

import { removeCartItem } from "@/action/cartAction";
import { formatPrice } from "@/lib/format/format";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  cartItems: ICartItem[];
  totalAmount: number;
}

const CartModal = ({ cartItems, totalAmount }: IProps) => {
  return (
    <>
      <h2 className="text-xl">Shopping Cart</h2>
      {/* LIST */}
      <div className="flex flex-col gap-8">
        {/* ITEM */}
        {cartItems?.map((item: ICartItem) => (
          <div className="flex gap-4" key={item.productTypeId}>
            {item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt=""
                width={72}
                height={96}
                className="object-cover rounded-md"
              />
            )}
            <div className="flex flex-col justify-between w-full">
              {/* TOP */}
              <div className="">
                {/* TITLE */}
                <div className="flex items-center justify-between gap-8">
                  <h3 className="font-semibold">{item.productTitle}</h3>
                  <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                    {item.quantity && item.quantity > 1 && (
                      <div className="text-xs text-green-500">
                        {item.quantity} x{" "}
                      </div>
                    )}
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
                {/* DESC */}
                <div className="text-sm text-gray-500">
                  {item.productTypeName}
                </div>
              </div>
              {/* BOTTOM */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Qty. {item.quantity}</span>
                <form action={removeCartItem}>
                  <input
                    type="hidden"
                    name="productId"
                    value={item.productId}
                  />
                  <input
                    type="hidden"
                    name="productTypeId"
                    value={item.productTypeId}
                  />
                  <button type="submit">
                    <span className="text-teal-600 cursor-pointer hover:opacity-50">
                      Remove
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {cartItems?.length == 0 && <div>Cart Empty</div>}
      </div>
      {/* BOTTOM */}
      <div className="">
        <div className="flex items-center justify-between font-semibold">
          <span className="">Subtotal</span>
          <span className="">{formatPrice(totalAmount)}</span>
        </div>
        <p className="text-gray-500 text-sm mt-2 mb-4">
          Shipping and taxes calculated at checkout.
        </p>
        <div className="flex justify-end text-sm">
          <Link href="/cart">
            <button className="rounded-md py-3 px-4 ring-1 ring-gray-300 hover:bg-teal-600 hover:text-white">
              View Cart
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartModal;
