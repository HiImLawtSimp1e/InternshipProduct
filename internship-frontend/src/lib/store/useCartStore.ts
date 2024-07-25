import { create } from "zustand";

type CartState = {
  cartItems: ICartItem[];
  isLoading: boolean;
  counter: number;
  totalAmount: number;
  getCart: () => void;
  clearCart: () => void;
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
        cache: "no-store",
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
  clearCart: () =>
    set({
      cartItems: [],
      counter: 0,
      totalAmount: 0,
    }),
}));
