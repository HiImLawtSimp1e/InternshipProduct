import ProductList from "@/components/dashboard/product/product-list";

const Products = async ({ params }: { params: { page?: number } }) => {
  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Product/admin";
  } else {
    url = `http://localhost:5000/api/Product/admin?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["productListAdmin"] },
  });

  const responseData: ApiResponse<PagingParams<IProduct[]>> = await res.json();
  const { data, success, message } = responseData;
  console.log(responseData);
  const { result, pages, currentPage } = data;

  return (
    <ProductList products={result} pages={pages} currentPage={currentPage} />
  );
};

const ProductsPage = ({
  searchParams,
}: {
  searchParams: { page?: number };
}) => {
  // Destructure page from searchParams
  const { page } = searchParams;
  
  // Render Products component with params prop
  return <Products params={{ page: page || undefined }} />;
};

export default ProductsPage;