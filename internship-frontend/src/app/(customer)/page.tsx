import Loading from "@/components/shop/loading";
import ProductList from "@/components/shop/main/product-list";
import { Suspense } from "react";

const Products = async () => {
  const res = await fetch(`http://localhost:5000/api/Product`, {
    method: "GET",
  });

  const responseData: ApiResponse<PagingParams<IProduct[]>> = await res.json();
  const { data, success, message } = responseData;
  console.log(responseData);
  const { result, pages, currentPage } = data;

  return <ProductList products={result} />;
};

const Home = () => {
  return (
    <div className="">
      {/* <Slides /> */}
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Featured Products</h1>
        <Suspense fallback={<Loading />}>
          <Products />
        </Suspense>
      </div>
      {/* <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Categories</h1>
        <Suspense fallback={<Loading />}>
          <Categories />
        </Suspense>
      </div> */}
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">News Products</h1>
        <Suspense fallback={<Loading />}>
          <Products />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
