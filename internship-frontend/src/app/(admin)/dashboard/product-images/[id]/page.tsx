import UpdateProductImageForm from "@/components/dashboard/product-image/update-image-form";

interface IProps {
  productId: string;
  id: string;
}

const ProductImage = async ({ productId, id }: IProps) => {
  const res = await fetch(`http://localhost:5000/api/ProductImage/${id}`, {
    method: "GET",
    next: { tags: ["getProductImage"] },
  });

  const productImage: ApiResponse<IProductImage> = await res.json();

  // console.log(productImage.data);

  return (
    <UpdateProductImageForm
      productId={productId}
      productImage={productImage.data}
    />
  );
};

const ProductImageDetailPage = ({
  searchParams,
  params,
}: {
  searchParams: { productId: string };
  params: { id: string };
}) => {
  const { productId } = searchParams;
  const { id } = params;
  return <ProductImage productId={productId} id={id} />;
};
export default ProductImageDetailPage;
