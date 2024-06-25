"use client";

import { useState } from "react";

const AddProduct = () => {
  const stockNumber = 4;
  const [quantity, setQuantity] = useState<number>(1);
  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
            >
              +
            </button>
          </div>
          <div className="text-xs">
            Only <span className="text-orange-500">{stockNumber} items</span>{" "}
            left!
            <br /> {"Don't "} miss it
          </div>
        </div>
      </div>
      <button className="w-36 text-sm rounded-3xl ring-1 ring-pink-400 text-pink-400 py-2 px-4 hover:bg-pink-400 hover:text-white">
        Add to cart
      </button>
    </div>
  );
};
export default AddProduct;
