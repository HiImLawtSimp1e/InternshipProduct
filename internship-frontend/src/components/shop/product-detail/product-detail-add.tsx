"use client";

import { addCartItem } from "@/action/cartAction";
import { useCustomActionState } from "@/lib/custom/customHook";
import { formatPrice } from "@/lib/format/format";
import { getAuthPublic } from "@/services/auth-service/auth-service";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  variants: IProductVariant[];
}

const AddProduct = ({ variants }: IProps) => {
  const [quantity, setQuantity] = useState<number>(1);

  const productId = variants[0].productId;
  const [productTypeId, setProductTypeId] = useState<string>(
    variants[0].productTypeId
  );

  const [stockNumber, setStockNumber] = useState<number>(variants[0].quantity);
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
    setQuantity(1);
    setSelectedVariant(variant);
    setProductTypeId(variant.productTypeId);
    setStockNumber(variant.quantity);
  };

  // for action
  const router = useRouter();

  const pathname = usePathname();

  const initialState: FormState = { errors: [] };
  const [formState, formAction] = useCustomActionState<FormState>(
    addCartItem,
    initialState
  );

  const [toastDisplayed, setToastDisplayed] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authToken = getAuthPublic();
    if (!authToken || authToken === "") {
      const redirectUrl = encodeURIComponent(pathname);
      router.push(`/login?redirectUrl=${redirectUrl}`);
    } else {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
      setToastDisplayed(false); // Reset toastDisplayed when submitting
    }
  };

  useEffect(() => {
    if (formState.errors.length > 0 && !toastDisplayed) {
      toast.error(formState.errors[0]);
      setToastDisplayed(true); // Set toastDisplayed to true to prevent multiple toasts
    }
    if (formState.success) {
      toast.success("Product has been added to the cart.");
      window.location.reload();
    }
  }, [formState, toastDisplayed]);

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
        <div>
          {stockNumber > 0 ? (
            <div>
              <h4 className="font-medium">Choose a Quantity</h4>
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
                    {"Only "}
                    <span className="text-orange-500">
                      {stockNumber} items
                    </span>{" "}
                    left!
                    <br />
                    {" Don't miss it"}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pt-2 min-h-[65px] text-2xl font-semibold text-red-500">
              Out of Stock
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="productTypeId" value={productTypeId} />
          <input type="hidden" name="quantity" value={quantity} />
          <button
            type="submit"
            className={`w-36 text-sm rounded-3xl ring-1 ring-teal-600 text-teal-600 py-2 px-4 ${
              stockNumber > 0
                ? "hover:bg-teal-600 hover:text-white"
                : "disabled:cursor-not-allowed disabled:opacity-50"
            }`}
            disabled={stockNumber <= 0}
          >
            Add to cart
          </button>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
