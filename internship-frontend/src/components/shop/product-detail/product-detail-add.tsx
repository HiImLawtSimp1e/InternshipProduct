"use client";

import { formatPrice } from "@/lib/format/format";
import { useState } from "react";

interface IProps {
  variants: IProductVariant[];
}

const AddProduct = ({ variants }: IProps) => {
  const stockNumber = 4;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<IProductVariant>(
    variants[0]
  );

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleSelectVariant = (variant: IProductVariant) => {
    setSelectedVariant(variant);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {selectedVariant.originalPrice <= selectedVariant.price ? (
          <h2 className="font-medium text-2xl">
            {formatPrice(selectedVariant.price)}
          </h2>
        ) : (
          <div className="flex items-center gap-4">
            <h3 className="text-xl text-gray-500 line-through">
              {formatPrice(selectedVariant.originalPrice)}
            </h3>
            <h2 className="font-medium text-2xl">
              {formatPrice(selectedVariant.price)}
            </h2>
          </div>
        )}
        <div className="h-[2px] bg-gray-100" />
        <div className="font-medium">Choose type</div>
        <ul className="flex items-center gap-3">
          {variants.map((variant) => {
            return (
              <li
                key={variant.productTypeId}
                className={`ring-1 ring-blue-600 rounded-md py-1 px-4 text-sm cursor-pointer ${
                  selectedVariant.productTypeId === variant.productTypeId
                    ? "text-white bg-blue-600"
                    : "text-blue-600 bg-white"
                }`}
                onClick={() => handleSelectVariant(variant)}
              >
                <p>{variant.productType.name}</p>
              </li>
            );
          })}
        </ul>
      </div>
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
            {stockNumber <= 10 && (
              <div className="text-xs">
                Only{" "}
                <span className="text-orange-500">{stockNumber} items</span>{" "}
                left!
                <br /> {"Don't "} miss it
              </div>
            )}
          </div>
        </div>
        <button className="w-36 text-sm rounded-3xl ring-1 ring-teal-600 text-teal-600 py-2 px-4 hover:bg-teal-600 hover:text-white">
          Add to cart
        </button>
      </div>
    </>
  );
};

export default AddProduct;
