import { getAuthPublic } from "@/services/auth-service/auth-service";
import { create } from "zustand";

// Utility function to get data from session storage
const getFromSessionStorage = <T>(key: string, defaultValue: T): T => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

type CounterSaleState = {
  products: IOrderItem[];
  orderItems: IOrderItem[];
  totalAmount: number;
  isLoading: boolean;
  getProducts: (searchText: string) => void;
  clearProducts: () => void;
  addOrderItem: (orderItem: IOrderItem) => void;
  changeQuantity: (
    productId: string,
    productTypeId: string,
    quantity: number
  ) => void;
  removeOrderItem: (productId: string, productTypeId: string) => void;
  calculateTotalAmount: () => number;
  updateSessionStorage: () => void;
};

const initialOrderItems = getFromSessionStorage<IOrderItem[]>("orderItems", []);
const initialTotalAmount = getFromSessionStorage<number>("totalAmount", 0);

const updateSessionStorage = (
  orderItems: IOrderItem[],
  totalAmount: number
) => {
  sessionStorage.setItem("orderItems", JSON.stringify(orderItems));
  sessionStorage.setItem("totalAmount", JSON.stringify(totalAmount));
};

export const useCounterSaleStore = create<CounterSaleState>((set, get) => ({
  products: [],
  orderItems: initialOrderItems,
  totalAmount: initialTotalAmount,
  isLoading: true,

  getProducts: async (searchText: string) => {
    const authToken = getAuthPublic();
    if (!authToken) {
      console.error("No auth token available.");
      return;
    }

    set({ isLoading: true });

    try {
      const res = await fetch(
        `http://localhost:5000/api/OrderCounter/search-product/${searchText}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          cache: "no-store",
        }
      );

      const responseData: ApiResponse<IOrderItem[]> = await res.json();
      const { data } = responseData;

      set({
        products: data,
        isLoading: false,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  clearProducts: () => set({ products: [] }),

  // Hàm tính tổng số tiền
  calculateTotalAmount: () => {
    const state = get();
    return state.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  // Hàm cập nhật sessionStorage
  updateSessionStorage: () => {
    const state = get();
    updateSessionStorage(state.orderItems, state.totalAmount);
  },

  // Hàm thêm OrderItem
  addOrderItem: (orderItem: IOrderItem) => {
    const state = get();
    const existingItem = state.orderItems.find(
      (item) =>
        item.productId === orderItem.productId &&
        item.productTypeId === orderItem.productTypeId
    );

    if (existingItem) {
      set((state) => ({
        orderItems: state.orderItems.map((item) =>
          item.productId === orderItem.productId &&
          item.productTypeId === orderItem.productTypeId
            ? { ...item, quantity: item.quantity + orderItem.quantity }
            : item
        ),
      }));
    } else {
      set((state) => ({
        orderItems: [...state.orderItems, orderItem],
      }));
    }

    // Cập nhật lại totalAmount và sessionStorage sau khi thêm sản phẩm
    const newTotalAmount = state.calculateTotalAmount();
    set({ totalAmount: newTotalAmount });
    state.updateSessionStorage();
  },

  // Hàm thay đổi số lượng sản phẩm
  changeQuantity: (
    productId: string,
    productTypeId: string,
    quantity: number
  ) => {
    set((state) => ({
      orderItems: state.orderItems.map((item) =>
        item.productId === productId && item.productTypeId === productTypeId
          ? { ...item, quantity }
          : item
      ),
      totalAmount: state.calculateTotalAmount(),
    }));
    // Cập nhật sessionStorage sau khi thay đổi số lượng
    get().updateSessionStorage();
  },

  // Hàm xoá OrderItem
  removeOrderItem: (productId: string, productTypeId: string) => {
    set((state) => ({
      orderItems: state.orderItems.filter(
        (item) =>
          !(
            item.productId === productId && item.productTypeId === productTypeId
          )
      ),
      totalAmount: state.calculateTotalAmount(),
    }));
    // Cập nhật sessionStorage sau khi xóa sản phẩm
    get().updateSessionStorage();
  },
}));
