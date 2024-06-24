import Loading from "@/components/shop/loading";
import CategoryList from "@/components/shop/main/category-list";
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

const Categories = async () => {
  const res = await fetch(`http://localhost:5000/api/Category`, {
    method: "GET",
  });

  const categories: ApiResponse<ICategory[]> = await res.json();
  const { data, success, message } = categories;
  console.log(data);

  return <CategoryList categories={data} />;
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
      <div className="pt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl">Categories</h1>
        <Suspense fallback={<Loading />}>
          <Categories />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
