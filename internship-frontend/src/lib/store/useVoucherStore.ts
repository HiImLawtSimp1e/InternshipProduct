import { getAuthPublic } from "@/services/auth-service/auth-service";
import { create } from "zustand";

type VoucherState = {
  voucher: IVoucher | null;
  isLoading: boolean;
  setVoucher: (voucher: IVoucher) => void;
  clearVoucher: () => void;
};

export const useVoucherStore = create<VoucherState>((set) => ({
  voucher: null,
  isLoading: false,
  setVoucher: (voucher: IVoucher) => {
    const authToken = getAuthPublic();
    if (!authToken) {
      // Nếu không có token, không gọi API và có thể thông báo cho người dùng hoặc xử lý theo cách khác
      console.error("No auth token available.");
      return;
    }

    set({ isLoading: true }); // Bắt đầu trạng thái loading

    try {
      set({
        voucher,
      });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      // Xử lý lỗi, ví dụ: thông báo lỗi cho người dùng hoặc ghi log
    } finally {
      set({ isLoading: false }); // Kết thúc trạng thái loading
    }
  },
  clearVoucher: () =>
    set({
      voucher: null,
    }),
}));
