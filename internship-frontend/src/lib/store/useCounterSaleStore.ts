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
  totalAmount: number;
  addOrderItem: (orderItem: IOrderItem) => void;
  changeQuantity: (
    productId: string,
    productTypeId: string,
    quantity: number
  ) => void;
  removeOrderItem: (productId: string, productTypeId: string) => void;
  updateSessionStorage: () => void;
  calculateTotalAmount: () => void;
};

const initialOrderItems = getFromSessionStorage<IOrderItem[]>("orderItems", []);

const updateSessionStorage = (orderItems: IOrderItem[]) => {
  sessionStorage.setItem("orderItems", JSON.stringify(orderItems));
};

// Function to calculate the total amount
const calculateTotal = (orderItems: IOrderItem[]): number => {
  return orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

export const useCounterSaleStore = create<CounterSaleState>((set, get) => ({
  orderItems: initialOrderItems,
  isLoading: true,
  totalAmount: calculateTotal(initialOrderItems), // Initialize totalAmount

  // Hàm cập nhật sessionStorage
  updateSessionStorage: () => {
    const state = get();
    updateSessionStorage(state.orderItems);
  },

  // Hàm tính toán lại totalAmount
  calculateTotalAmount: () => {
    const state = get();
    const newTotal = calculateTotal(state.orderItems);
    set({ totalAmount: newTotal });
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

    // Cập nhật lại sessionStorage và totalAmount sau khi thêm sản phẩm
    state.updateSessionStorage();
    state.calculateTotalAmount();
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
    // Cập nhật sessionStorage và totalAmount sau khi thay đổi số lượng
    get().updateSessionStorage();
    get().calculateTotalAmount();
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
    // Cập nhật sessionStorage và totalAmount sau khi xóa sản phẩm
    get().updateSessionStorage();
    get().calculateTotalAmount();
  },
}));

interface IOrderItem {
  productId: string;
  productTypeId: string;
  productTitle: string;
  productTypeName: string;
  price: number;
  originalPrice: number;
  imageUrl?: string;
  quantity: number;
}
