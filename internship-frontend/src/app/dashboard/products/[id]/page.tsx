import ProductDetail from "@/components/dashboard/product/product-detail";

const Product = async ({ id }: { id: number }) => {
  const res = await fetch(`http://localhost:5000/api/Product/admin/${id}`, {
    method: "GET",
    next: { tags: ["productDetailAdmin"] },
  });

  const responseData: ApiResponse<IProduct> = await res.json();
  const { data, success, message } = responseData;
  console.log(data);

  return <ProductDetail product={data} />;
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
