import { getAuthPublic } from "@/services/auth-service/auth-service";
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
  isLoading: false,
  counter: 0,
  totalAmount: 0,
  getCart: async () => {
    const authToken = getAuthPublic();
    if (!authToken) {
      // Nếu không có token, không gọi API và có thể thông báo cho người dùng hoặc xử lý theo cách khác
      console.error("No auth token available.");
      return;
    }

    set({ isLoading: true }); // Bắt đầu trạng thái loading

    try {
      const res = await fetch("http://localhost:5000/api/Cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        // Kiểm tra xem phản hồi có phải là lỗi hay không
        throw new Error("Network response was not ok.");
      }

      const responseData: ApiResponse<ICartItem[]> = await res.json();
      const { data, success, message } = responseData;

      if (!success) {
        // Xử lý trường hợp không thành công (ví dụ: thông báo lỗi)
        console.error(message);
        return;
      }

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
      console.error("Failed to fetch cart:", err);
      // Xử lý lỗi, ví dụ: thông báo lỗi cho người dùng hoặc ghi log
    } finally {
      set({ isLoading: false }); // Kết thúc trạng thái loading
    }
  },
  clearCart: () =>
    set({
      cartItems: [],
      counter: 0,
      totalAmount: 0,
    }),
}));
