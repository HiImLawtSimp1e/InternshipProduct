import UpdateProductAttributeValueForm from "@/components/dashboard/product-attribute-value/update-product-attribute-value-form";

interface IProps {
  productId: string;
  productAttributeId: string;
}

const ProductValue = async ({ productId, productAttributeId }: IProps) => {
  const res = await fetch(
    `http://localhost:5000/api/ProductValue/${productId}/?productAttributeId=${productAttributeId}`,
    {
      method: "GET",
      next: { tags: ["getAttributeValue"] },
    }
  );

  const productValue: ApiResponse<IProductValue> = await res.json();

  // console.log(productValue.data);

  return <UpdateProductAttributeValueForm productValue={productValue.data} />;
};

const UpdateProductValuePage = ({
  searchParams,
  params,
}: {
  searchParams: { productId: string };
  params: { id: string };
}) => {
  const { productId } = searchParams;
  const { id } = params;
  return <ProductValue productId={productId} productAttributeId={id} />;
};

export default UpdateProductValuePage;
