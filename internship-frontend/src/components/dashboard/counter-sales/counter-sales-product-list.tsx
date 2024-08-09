"use client";

import { formatPrice, formatProductType } from "@/lib/format/format";
import { useCounterSaleStore } from "@/lib/store/useCounterSaleStore";
import _ from "lodash";
import { ChangeEvent, useCallback, useRef } from "react";
import { MdSearch } from "react-icons/md";
import Image from "next/image";

const CounterSalesProductList = () => {
  const { products, getProducts, addOrderItem } = useCounterSaleStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedHandleChange = useCallback(
    _.debounce((text: string) => {
      getProducts(text);
    }, 200),
    [] // Thêm các dependency vào đây nếu cần thiết
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedHandleChange(event.target.value);
  };

  const handleAddItem = (orderItem: IOrderItem) => {
    addOrderItem(orderItem);
  };
  return (
    <div className="bg-gray-800 p-5 rounded-lg">
      <div className="mb-2 p-2 flex items-center gap-2 bg-gray-700 rounded-lg w-max">
        <MdSearch />
        <input
          type="text"
          name="searchText"
          placeholder="Search Product..."
          ref={inputRef}
          onChange={handleChange}
          className="bg-transparent border-none text-white outline-none"
        />
      </div>
      {products.length > 0 && (
        <table className="w-full text-left text-gray-400">
          <thead className="bg-gray-700 text-gray-400 uppercase">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Variant</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Original Price</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item: IOrderItem, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={item?.imageUrl || "/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                    />
                    {item.productTitle}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {formatProductType(item.productTypeName)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-2" key={index}>
                    {formatPrice(item.price)}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div
                    className={`flex flex-col gap-2 ${
                      item.originalPrice > item.price ? "line-through" : ""
                    }`}
                    key={index}
                  >
                    {item.originalPrice > item.price
                      ? formatPrice(item.originalPrice)
                      : formatPrice(item.price)}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleAddItem(item)}
                    className="m-1 px-5 py-2 bg-teal-500 text-white rounded"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default CounterSalesProductList;
