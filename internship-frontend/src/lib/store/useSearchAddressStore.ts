import { getAuthPublic } from "@/services/auth-service/auth-service";
import { create } from "zustand";

// Utility function to get data from session storage
const getFromSessionStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }
  return defaultValue;
};

type SearchAddressState = {
  address: IAddress | null;
  addressList: IAddress[];
  isLoading: boolean;
  getAddresses: (searchText: string) => void;
  clearAddresses: () => void;
  setAddress: (address: IAddress) => void;
  updateSessionStorage: () => void;
};

const initialAddress = getFromSessionStorage<IAddress | null>(
  "orderAddress",
  null
);

const updateSessionStorage = (address: IAddress | null) => {
  sessionStorage.setItem("orderAddress", JSON.stringify(address));
};

export const useSearchAddressStore = create<SearchAddressState>((set, get) => ({
  address: initialAddress,
  addressList: [],
  isLoading: true,

  // Hàm cập nhật sessionStorage
  updateSessionStorage: () => {
    const state = get();
    updateSessionStorage(state.address);
  },

  getAddresses: async (searchText: string) => {
    const authToken = getAuthPublic();
    if (!authToken) {
      console.error("No auth token available.");
      return;
    }

    set({ isLoading: true });

    try {
      const res = await fetch(
        `http://localhost:5000/api/OrderCounter/search-address/${searchText}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          cache: "no-store",
        }
      );

      const responseData: ApiResponse<IAddress[]> = await res.json();
      const { data } = responseData;

      set({
        addressList: data,
        isLoading: false,
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false }));
    }
  },
  clearAddresses: () => set({ addressList: [] }),
  setAddress: (address: IAddress) => {
    set({ address });
    // Cập nhật sessionStorage sau khi thay đổi địa chỉ khách hàng
    get().updateSessionStorage();
  },
}));
