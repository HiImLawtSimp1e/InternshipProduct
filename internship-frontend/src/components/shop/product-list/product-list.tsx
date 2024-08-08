import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format/format";
import Pagination from "@/components/ui/pagination";

interface IProps {
  products: IProduct[];
  pages: number;
  currentPage: number;
  pageSize?: number;
}

const ShopProductList = ({
  products,
  pages,
  currentPage,
  pageSize,
}: IProps) => {
  return (
    <div className="">
      <div className="mt-12 flex flex-wrap gap-4">
        {products.map((product: IProduct) => (
          <div
            className="w-full flex flex-col gap-4 md:w-[45%] lg:w-[30%] xl:w-[22%] pb-2 rounded-md bg-white"
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
            <div className="m-2 px-2 flex justify-end min-h-[64px]">
              {product.productVariants != null && (
                <div>
                  {product.productVariants[0].originalPrice <=
                  product.productVariants[0].price ? (
                    <h2 className="font-medium text-2xl lg:text-lg">
                      {formatPrice(product.productVariants[0].price)}
                    </h2>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <h3 className="text-lg text-gray-500 line-through lg:text-sm">
                        {formatPrice(product.productVariants[0].originalPrice)}
                      </h3>
                      <h2 className="text-2xl font-medium lg:text-lg">
                        {formatPrice(product.productVariants[0].price)}
                      </h2>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mx-1 flex justify-center">
              <Link href={"/product/" + product.slug}>
                <button className="rounded-2xl ring-1 text-teal-600 py-3 px-6 text-lg font-semibold hover:bg-teal-600 hover:text-white lg:py-2 lg:px-4 lg:text-xs">
                  Add to Cart
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        pageSize={pageSize}
        clsColor="blue"
      />
    </div>
  );
};

export default ShopProductList;
