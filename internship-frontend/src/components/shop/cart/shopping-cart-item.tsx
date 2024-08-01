"use client";

import { removeCartItem } from "@/action/cartAction";
import { formatPrice } from "@/lib/format/format";
import Image from "next/image";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ShoppingCartItemQlt from "./shoping-cart-item-qlt";

interface IProps {
  cartItem: ICartItem;
}

const ShoppingCartItem = ({ cartItem }: IProps) => {
  //for action
  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    removeCartItem,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formAction(formData);
    setToastDisplayed(false); // Reset toastDisplayed when submitting
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error(formState.errors[0]);
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Product has been removed from the cart");
      window.location.reload();
    }
  }, [formState, toastDisplayed]);
  return (
    <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
      <div className="w-full sm:w-40 relative">
        <Image
          src={cartItem.imageUrl}
          alt=""
          fill
          sizes="25vw"
          className="absolute object-cover rounded-md shadow-md"
        />
      </div>

      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-2xl font-bold text-gray-900 lg:text-lg">
            {cartItem.productTitle}
          </h2>
          <p className="mt-1 text-md text-gray-400 lg:text-sm">
            {cartItem.productTypeName}
          </p>
        </div>
        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="flex items-center border-gray-100">
            <ShoppingCartItemQlt cartItem={cartItem} />
          </div>
          <div className="flex items-center space-x-4">
            <p className="flex flex-col text-xl">
              {cartItem.originalPrice > cartItem.price ? (
                <>
                  {formatPrice(cartItem.price)}
                  <span className="text-base text-red-300 line-through">
                    {" "}
                    {formatPrice(cartItem.originalPrice)}
                  </span>
                </>
              ) : (
                formatPrice(cartItem.price)
              )}
            </p>{" "}
            <form onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="productId"
                value={cartItem.productId}
              />
              <input
                type="hidden"
                name="productTypeId"
                value={cartItem.productTypeId}
              />
              <button type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-8 w-8 cursor-pointer duration-150 lg:h-5 lg:w-5 hover:text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartItem;
