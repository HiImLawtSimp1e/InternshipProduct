"use client";

import { formatPrice } from "@/lib/format/format";
import { useCounterSaleStore } from "@/lib/store/useCounterSaleStore";
import Image from "next/image";

interface IProps {
  item: IOrderItem;
}

const CounterSalesOrderItem = ({ item }: IProps) => {
  const { changeQuantity, removeOrderItem } = useCounterSaleStore();

  const handleRemoveOrderItem = (productId: string, productTypeId: string) => {
    removeOrderItem(productId, productTypeId);
  };

  const handleChangeQuantity = (
    productId: string,
    productTypeId: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      quantity = 1;
    }
    changeQuantity(productId, productTypeId, quantity);
  };

  return (
    <div className="justify-between rounded-lg bg-gray-500 p-6 shadow-md sm:flex sm:justify-start">
      <div className="w-full sm:w-40 relative">
        <Image
          src={item?.imageUrl || "/noavatar.png"}
          alt=""
          fill
          sizes="25vw"
          className="absolute object-cover rounded-md shadow-md"
        />
      </div>

      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-2xl font-bold text-gray-100 lg:text-lg">
            {item.productTitle}
          </h2>
          <p className="mt-1 text-md text-gray-400 lg:text-sm">
            {item.productTypeName}
          </p>
        </div>
        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="flex items-center">
            <button
              onClick={() =>
                handleChangeQuantity(
                  item.productId,
                  item.productTypeId,
                  item.quantity - 1
                )
              }
              className={`rounded-l bg-gray-400 py-2 px-4 text-2xl duration-100 lg:py-1 lg:px-4 lg:text-lg ${
                item.quantity - 1 <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-blue-200 hover:text-blue-50"
              } `}
            >
              <span>-</span>
            </button>
            <input
              className="h-12 w-12 text-xl bg-gray-400 text-center lg:h-9 lg:w-9 lg:text-sm outline-none"
              type="number"
              value={item.quantity}
              min="1"
              readOnly
            />
            <button
              onClick={() =>
                handleChangeQuantity(
                  item.productId,
                  item.productTypeId,
                  item.quantity + 1
                )
              }
              className="p-2 cursor-pointer rounded-r bg-gray-400 py-2 px-4 text-2xl duration-100 lg:py-1 lg:px-4 lg:text-lg hover:bg-blue-200 hover:text-blue-50"
            >
              <span>+</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <p className="flex flex-col text-xl">
              {item.originalPrice > item.price ? (
                <>
                  {formatPrice(item.price)}
                  <span className="text-base text-red-300 line-through">
                    {" "}
                    {formatPrice(item.originalPrice)}
                  </span>
                </>
              ) : (
                formatPrice(item.price)
              )}
            </p>
            <button
              onClick={() =>
                handleRemoveOrderItem(item.productId, item.productTypeId)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8 cursor-pointer duration-150 lg:h-5 lg:w-5 hover:text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterSalesOrderItem;
