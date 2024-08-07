import { Suspense } from "react";
import HomeShopProductList from "@/components/shop/home/home-product-list";
import Loading from "@/components/ui/loading";

const Products = async () => {
  const res = await fetch("http://localhost:5000/api/Product", {
    method: "GET",
    next: { tags: ["shopProductList"] },
  });

  const responseData: ApiResponse<PagingParams<IProduct[]>> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage, pageResults } = data;

  return <HomeShopProductList products={result} />;
};

const Home = () => {
  return (
    <div className="bg-gray-100 py-24">
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">New Products</h1>
        <Suspense fallback={<Loading />}>
          <Products />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
