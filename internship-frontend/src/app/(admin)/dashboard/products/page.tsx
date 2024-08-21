import ProductList from "@/components/dashboard/product/product-list";
import { cookies as nextCookies } from "next/headers";

const Products = async ({ params }: { params: { page?: number } }) => {
  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Product/admin";
  } else {
    url = `http://localhost:5000/api/Product/admin?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // header Authorization
    },
    next: { tags: ["productListAdmin"] },
  });

  const responseData: ApiResponse<PagingParams<IProduct[]>> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
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
