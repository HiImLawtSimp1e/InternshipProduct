import { create } from "zustand";

// Utility function to get data from session storage
const getFromSessionStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
};

type CounterSaleState = {
  orderItems: IOrderItem[];
  isLoading: boolean;
  addOrderItem: (orderItem: IOrderItem) => void;
  changeQuantity: (
    productId: string,
    productTypeId: string,
    quantity: number
  ) => void;
  removeOrderItem: (productId: string, productTypeId: string) => void;
  updateSessionStorage: () => void;
};

const initialOrderItems = getFromSessionStorage<IOrderItem[]>("orderItems", []);

const updateSessionStorage = (orderItems: IOrderItem[]) => {
  sessionStorage.setItem("orderItems", JSON.stringify(orderItems));
};

export const useCounterSaleStore = create<CounterSaleState>((set, get) => ({
  orderItems: initialOrderItems,
  isLoading: true,

  // Hàm cập nhật sessionStorage
  updateSessionStorage: () => {
    const state = get();
    updateSessionStorage(state.orderItems);
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

    // Cập nhật lại sessionStorage sau khi thêm sản phẩm
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
    }));
    // Cập nhật sessionStorage sau khi xóa sản phẩm
    get().updateSessionStorage();
  },
}));
