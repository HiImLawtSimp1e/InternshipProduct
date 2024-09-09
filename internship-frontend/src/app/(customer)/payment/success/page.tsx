"use client";

import SuccessSvg from "@/components/ui/svg/success-svg";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mt-24 h-screen">
      <div className="bg-white p-6 md:mx-auto">
        <div className="flex items-center justify-center mb-4">
          <SuccessSvg />
        </div>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p className="text-gray-600 my-2">Invoice code: {orderId}</p>
          <p>Have a great day!</p>
          <div className="py-10 text-center">
            <Link
              href="/order-history"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              GO TO MY ORDER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
