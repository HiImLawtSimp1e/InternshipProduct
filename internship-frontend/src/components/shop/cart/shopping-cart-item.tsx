import { removeCartItem, updateQuantity } from "@/action/cartAction";
import { formatPrice } from "@/lib/format/format";
import Image from "next/image";

interface IProps {
  cartItem: ICartItem;
}

const ShoppingCartItem = ({ cartItem }: IProps) => {
  return (
    <div className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
      <div className="w-full sm:w-40 relative">
        <Image
          src={cartItem.imageUrl}
          alt=""
          fill
          sizes="25vw"
          className="absolute object-cover rounded-md shadow-md"
        />
      </div>

      <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-2xl font-bold text-gray-900 lg:text-lg">
            {cartItem.productTitle}
          </h2>
          <p className="mt-1 text-md text-gray-400 lg:text-sm">
            {cartItem.productTypeName}
          </p>
        </div>
        <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
          <div className="flex items-center border-gray-100">
            <form action={updateQuantity}>
              <input
                type="hidden"
                name="productId"
                value={cartItem.productId}
              />
              <input
                type="hidden"
                name="productTypeId"
                value={cartItem.productTypeId}
              />
              <input
                type="hidden"
                name="quantity"
                value={cartItem.quantity - 1 > 0 ? cartItem.quantity - 1 : 1}
              />
              <button
                type="submit"
                className={`rounded-l bg-gray-100 py-2 px-4 text-2xl duration-100 lg:py-1 lg:px-4 lg:text-lg ${
                  cartItem.quantity - 1 <= 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-blue-500 hover:text-blue-50"
                } `}
              >
                <span>-</span>
              </button>
            </form>

            <input
              className="border h-12 w-12 text-xl bg-white text-center lg:h-9 lg:w-9 lg:text-sm outline-none"
              type="number"
              value={cartItem.quantity}
              min="1"
              readOnly
            />
            <form action={updateQuantity}>
              <input
                type="hidden"
                name="productId"
                value={cartItem.productId}
              />
              <input
                type="hidden"
                name="productTypeId"
                value={cartItem.productTypeId}
              />
              <input
                type="hidden"
                name="quantity"
                value={cartItem.quantity + 1}
              />
              <button
                type="submit"
                className="p-2 cursor-pointer rounded-r bg-gray-100 py-2 px-4 text-2xl duration-100 lg:py-1 lg:px-4 lg:text-lg hover:bg-blue-500 hover:text-blue-50"
              >
                <span>+</span>
              </button>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-xl">{formatPrice(cartItem.price)}</p>
            <form action={removeCartItem}>
              <input
                type="hidden"
                name="productId"
                value={cartItem.productId}
              />
              <input
                type="hidden"
                name="productTypeId"
                value={cartItem.productTypeId}
              />
              <button type="submit">
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartItem;
