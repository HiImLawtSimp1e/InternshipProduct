"use client";

import { updateQuantity } from "@/action/cartAction";
import { useCustomActionState } from "@/lib/custom/customHook";
import { useCartStore } from "@/lib/store/useCartStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  cartItem: ICartItem;
}

const ShoppingCartItemQlt = ({ cartItem }: IProps) => {
  const { getCart } = useCartStore();

  //for action
  const router = useRouter();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    updateQuantity,
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
      getCart();
    }
  }, [formState, toastDisplayed]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="productId" value={cartItem.productId} />
        <input
          type="hidden"
          name="productTypeId"
          value={cartItem.productTypeId}
        />
        <input
          type="hidden"
          name="quantity"
          value={cartItem.quantity - 1 > 0 ? cartItem.quantity - 1 : 1}
        />
        <button
          type="submit"
          className={`rounded-l bg-gray-100 py-2 px-4 text-2xl duration-100 lg:py-1 lg:px-4 lg:text-lg ${
            cartItem.quantity - 1 <= 0
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-blue-500 hover:text-blue-50"
          } `}
        >
          <span>-</span>
        </button>
      </form>

      <input
        className="border h-12 w-12 text-xl bg-white text-center lg:h-9 lg:w-9 lg:text-sm outline-none"
        type="number"
        value={cartItem.quantity}
        min="1"
        readOnly
      />
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="productId" value={cartItem.productId} />
        <input
          type="hidden"
          name="productTypeId"
          value={cartItem.productTypeId}
        />
        <input type="hidden" name="quantity" value={cartItem.quantity + 1} />
        <button
          type="submit"
          className="p-2 cursor-pointer rounded-r bg-gray-100 py-2 px-4 text-2xl duration-100 lg:py-1 lg:px-4 lg:text-lg hover:bg-blue-500 hover:text-blue-50"
        >
          <span>+</span>
        </button>
      </form>
    </>
  );
};

export default ShoppingCartItemQlt;
