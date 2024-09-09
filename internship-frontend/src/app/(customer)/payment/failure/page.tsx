"use client";

import ErrorSvg from "@/components/ui/svg/error-svg";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaymentFailure = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className=" mt-24 h-screen">
      <div className="bg-white p-6 md:mx-auto">
        <div className="flex items-center justify-center mb-4">
          <ErrorSvg />
        </div>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Failed!
          </h3>
          <p className="text-gray-600 my-2">
            Unfortunately, your payment was not successful. Please try again.
          </p>
          <p>If the problem persists, contact our support team.</p>
          <p>{message ? `Error: ${message}` : ""}</p>
          <div className="py-10 text-center">
            <Link
              href="/"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              GO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
