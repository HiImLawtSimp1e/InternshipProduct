import CategorySidebar from "@/components/shop/category-list/category-sidebar";
import ShopProductList from "@/components/shop/product-list/product-list";
import Loading from "@/components/ui/loading";
import Image from "next/image";
import { Suspense } from "react";

interface IProps {
  categorySlug: string | null;
  page?: number;
}

const Products = async ({ categorySlug, page }: IProps) => {
  let url = "";
  if (page == null) {
    url = `http://localhost:5000/api/Product/list/${categorySlug}`;
  } else {
    url = `http://localhost:5000/api/Product/list/${categorySlug}?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["shopProductList"] },
  });

  const responseData: ApiResponse<PagingParams<IProduct[]>> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
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

const Categories = async () => {
  const res = await fetch(`http://localhost:5000/api/Category`, {
    method: "GET",
  });

  const categories: ApiResponse<ICategory[]> = await res.json();
  const { data, success, message } = categories;
  // console.log(data);

  return <CategorySidebar categories={data} />;
};

const CategoryPage = ({
  params,
  searchParams,
}: {
  params: { categorySlug: string };
  searchParams: { page?: number };
}) => {
  const { categorySlug } = params;
  const { page } = searchParams;
  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* CAMPAIGN */}
      <div className="hidden bg-pink-50 px-4 sm:flex justify-between h-64">
        <div className="w-2/3 flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
            Grab up to 50% off on
            <br /> Selected Products
          </h1>
        </div>
        <div className="relative w-1/3">
          <Image src="/woman.png" alt="" fill className="object-contain" />
        </div>
      </div>
      <div className="flex">
        <div className="hidden md:block md:basis-[18%]">
          <Suspense fallback={<Loading />}>
            <Categories />
          </Suspense>
        </div>
        <div className="ml-4 basis-full md:basis-[82%]">
          <Suspense fallback={<Loading />}>
            <Products
              categorySlug={categorySlug || null}
              page={page || undefined}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
