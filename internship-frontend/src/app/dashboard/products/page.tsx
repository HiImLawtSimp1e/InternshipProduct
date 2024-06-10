import ProductList from "@/components/dashboard/product/product-list";

const Products = async () => {
  const res = await fetch(`http://localhost:5000/api/Product/admin`, {
    method: "GET",
  });

  const responseData: ApiResponse<IProduct[]> = await res.json();
  const { data, success, message } = responseData;

  return <ProductList products={data} />;
};

const ProductsPage = () => {
  return <Products />;
};
export default ProductsPage;
