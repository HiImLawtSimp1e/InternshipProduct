import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format/format";

interface IProps {
  products: IProduct[];
}

const ShopProductList = ({ products }: IProps) => {
  return (
    <div className="mt-12 flex gap-y-12 justify-between flex-wrap">
      {products.map((product: IProduct) => (
        <div
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] pb-2 rounded-md bg-white"
          key={product.id}
        >
          <div className="relative w-full h-80">
            <Link href={"/product/" + product.slug}>
              <Image
                src={product.imageUrl?.toString() || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md z-10 shadow-md"
              />
            </Link>
          </div>
          <div className="ml-1 px-2">
            <div className="my-4 flex justify-between items-center">
              <Link href={"/product/" + product.slug}>
                <span className="mr-1 h-11 font-medium title-overflow hover:opacity-70">
                  {product.title}
                </span>
              </Link>
            </div>
            <div className="h-20 text-sm text-gray-500 description-overflow">
              {product.description}
            </div>
          </div>
          <div className="ml-1 p-2 flex justify-between items-center">
            {product.productVariants != null && (
              <span className="font-semibold">
                {formatPrice(product.productVariants[0].price)}
              </span>
            )}
            <div className="flex justify-end">
              <Link href={"/product/" + product.slug}>
                <button className="rounded-2xl ring-1 text-teal-600 py-2 px-4 text-xs font-semibold hover:bg-teal-600 hover:text-white">
                  Add to Cart
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopProductList;
