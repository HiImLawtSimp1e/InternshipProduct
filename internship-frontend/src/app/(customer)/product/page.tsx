import Loading from "@/components/shop/loading";
import ShopProductList from "@/components/shop/product-list/product-list";
import Image from "next/image";
import { Suspense } from "react";

interface IProps {
  categorySlug: string | null;
  page?: number;
}

const Products = async ({ categorySlug, page }: IProps) => {
  let url = "";
  if (categorySlug != null) {
    if (page == null) {
      url = `http://localhost:5000/api/Product/list/${categorySlug}`;
    } else {
      url = `http://localhost:5000/api/Product/list/${categorySlug}?page=${page}`;
    }
  } else {
    if (page == null) {
      url = `http://localhost:5000/api/Product`;
    } else {
      url = `http://localhost:5000/api/Product?page=${page}`;
    }
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["shopProductList"] },
  });

  const responseData: ApiResponse<PagingParams<IProduct[]>> = await res.json();
  const { data, success, message } = responseData;
  console.log(responseData);
  const { result, pages, currentPage, pageResults } = data;

  return (
    <ShopProductList
      products={result}
      pages={pages}
      currentPage={currentPage}
      pageSize={pageResults}
    />
  );
};

const ProductPage = ({
  searchParams,
}: {
  searchParams: { category?: string; page?: number };
}) => {
  const { category, page } = searchParams;
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-lama text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <Products categorySlug={category || null} page={page || undefined} />
      </Suspense>
    </div>
  );
};

export default ProductPage;
