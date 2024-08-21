import ProductDetail from "@/components/dashboard/product/product-detail";
import { cookies as nextCookies } from "next/headers";

const Product = async ({ id }: { id: number }) => {
  //get access token form cookie
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const productDetailRes = await fetch(
    `http://localhost:5000/api/Product/admin/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // header Authorization
      },
      next: { tags: ["productDetailAdmin"] },
    }
  );

  const categorySelectRes = await fetch(
    `http://localhost:5000/api/Category/select`,
    {
      method: "GET",
      next: { tags: ["categorySelect"] },
    }
  );

  const productDetail: ApiResponse<IProduct> = await productDetailRes.json();
  const categorySelect: ApiResponse<ICategorySelect[]> =
    await categorySelectRes.json();

  return (
    <ProductDetail
      product={productDetail.data}
      categorySelect={categorySelect.data}
    />
  );
};

const ProductDetailPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <>
      <Product id={id} />
    </>
  );
};
export default ProductDetailPage;
