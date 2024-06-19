import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format/format";

interface IProps {
  products: IProduct[];
}

const ProductList = ({ products }: IProps) => {
  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {products.map((product: IProduct) => (
        <Link
          href={"/product/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product.id}
        >
          <div className="relative w-full h-80">
            <Image
              src={"/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            {/* {product.media_image && (
              <Image
                src={product.media_image || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )} */}
          </div>
          <div className="flex justify-between">
            <span className="mr-1 h-11 font-medium title-overflow hover:opacity-70">
              {product.title}
            </span>
            <span className="font-semibold">
              {formatPrice(product.productVariants[0].price)}
            </span>
          </div>
          <div className="h-20 text-sm text-gray-500 description-overflow">
            {product.description}
          </div>
          <button className="rounded-2xl ring-1 text-rose-400 w-max py-2 px-4 text-xs hover:bg-rose-400 hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
