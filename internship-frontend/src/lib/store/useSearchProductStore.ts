import { getAuthPublic } from "@/services/auth-service/auth-service";
import { create } from "zustand";

type SearchProductState = {
  products: IOrderItem[];
  isLoading: boolean;
  getProducts: (searchText: string) => void;
  clearProducts: () => void;
};

export const useSearchProductStore = create<SearchProductState>((set, get) => ({
  products: [],
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
}));
