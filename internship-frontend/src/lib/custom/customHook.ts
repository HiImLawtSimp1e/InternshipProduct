import { useState } from "react";
import { create } from "zustand";

export function useCustomActionState<T>(
  action: (prevState: T, formData: FormData) => Promise<T | undefined>,
  initialState: T
) {
  const [state, setState] = useState<T>(initialState);

  const handleAction = async (formData: FormData) => {
    const result = await action(state, formData);
    if (result) {
      setState(result);
    }
  };

  return [state, handleAction] as const;
}

type CartState = {
  cartItems: ICartItem[];
  isLoading: boolean;
  counter: number;
  totalAmount: number;
  getCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  isLoading: true,
  counter: 0,
  totalAmount: 0,
  getCart: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/Cart", {
        method: "GET",
      });

      const responseData: ApiResponse<ICartItem[]> = await res.json();
      const { data, success, message } = responseData;
      const total = data.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.price * currentValue.quantity,
        0
      );
      set({
        cartItems: data,
        counter: data.length || 0,
        totalAmount: total,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
}));
