import ProductDetail from "@/components/dashboard/product/product-detail";

const Product = async ({ id }: { id: number }) => {
  const productDetailRes = await fetch(
    `http://localhost:5000/api/Product/admin/${id}`,
    {
      method: "GET",
      next: { tags: ["productDetailAdmin"] },
    }
  );

  const categorySelectRes = await fetch(
    `http://localhost:5000/api/Category/admin`,
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
