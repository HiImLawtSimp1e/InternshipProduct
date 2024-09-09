"use client";

import { getAuthPublic } from "@/services/auth-service/auth-service";
import { useVoucherStore } from "../store/useVoucherStore";

const VnPayment = () => {
  const { voucher } = useVoucherStore();

  const handlePayment = async (voucher: IVoucher | null) => {
    const authToken = getAuthPublic();
    if (!authToken) {
      return { errors: ["You need to log in"] };
    }

    let url = "";
    if (voucher?.id !== null && voucher?.id !== undefined) {
      url = `http://localhost:5000/api/Payment/vnpay/create-payment?voucherId=${voucher?.id}`;
      console.log(voucher?.id);
    } else {
      url = `http://localhost:5000/api/Payment/vnpay/create-payment`;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      //console.log(res);

      const responseData = await res.json();

      // console.log(responseData.paymentUrl.result);
      window.location.href = responseData.paymentUrl.result; // Chuyển người dùng đến URL thanh toán VNPay
    } catch (error) {
      // Kiểm tra nếu error có thuộc tính response
      if (error instanceof Error) {
        console.error("Lỗi:", error.message);
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  return (
    <div>
      <button
        type="submit"
        className="mt-6 w-full rounded-md border border-blue-500 bg-white text-blue-500 text-2xl py-4 font-medium md:text-lg md:py-2"
        onClick={() => handlePayment(voucher)}
      >
        VnPay
      </button>
    </div>
  );
};

export default VnPayment;
