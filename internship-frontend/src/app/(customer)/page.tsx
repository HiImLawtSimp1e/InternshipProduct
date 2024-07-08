import Loading from "@/components/shop/loading";
import { Suspense } from "react";
import HomeShopProductList from "@/components/shop/home/home-product-list";
import api from "@/services/axios/instance-api";

const Products = async () => {
  const res = await api.get("/Product");

  const responseData: ApiResponse<PagingParams<IProduct[]>> = res.data;

  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage } = data;

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
