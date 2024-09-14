import { formatPrice } from "@/lib/format/format";
import Image from "next/image";

interface IProps {
  cartItems: ICartItem[];
}

const PaymentCartItem = ({ cartItems }: IProps) => {
  return (
    <div className="flex flex-col justify-start items-start  w-full space-y-4 md:space-y-6 xl:space-y-8">
      <div className="flex flex-col justify-start items-start bg-gray-50 rounded-md shadow-lg px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
        <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
          Products
        </p>
        {cartItems?.map((item, index) => (
          <div
            key={index}
            className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
          >
            <div className="my-4 relative w-full md:h-32 md:w-40 opacity-70">
              <Image
                className="w-full hidden md:block"
                src={item?.imageUrl || "/product.png"}
                alt=""
                fill
              />
            </div>
            <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
              <div className="w-full flex flex-col justify-start items-start space-y-8">
                <h3 className="text-xl xl:text-xl font-semibold leading-6 text-gray-800">
                  {item.productTitle}
                </h3>
                <div className="flex justify-start items-start flex-col space-y-2">
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-400">
                      {item.productTypeName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between space-x-8 items-start w-full">
                <p className="text-base xl:text-lg leading-6">
                  {item.originalPrice > item.price ? (
                    <>
                      {formatPrice(item.price)}
                      <span className="text-red-300 line-through">
                        {" "}
                        {formatPrice(item.originalPrice)}
                      </span>
                    </>
                  ) : (
                    formatPrice(item.price)
                  )}
                </p>
                <p className="text-base xl:text-lg leading-6 text-gray-400">
                  x{item.quantity}
                </p>
                <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentCartItem;
