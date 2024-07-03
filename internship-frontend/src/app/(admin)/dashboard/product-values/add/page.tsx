import AddProductAttributeValueForm from "@/components/dashboard/product-attribute-value/add-product-attribute-value-form";

interface IProps {
  productId: string;
}

const ProductValue = async ({ productId }: IProps) => {
  const attributeSelectRes = await fetch(
    `http://localhost:5000/api/ProductAttribute/select/${productId}`,
    {
      method: "GET",
      next: { tags: ["selectProductAttribute"] },
    }
  );

  const attributeSelect: ApiResponse<IProductAttribute[]> =
    await attributeSelectRes.json();

  return (
    <AddProductAttributeValueForm
      productId={productId}
      attributeSelect={attributeSelect.data}
    />
  );
};

const AddProductValuePage = ({
  searchParams,
}: {
  searchParams: { productId: string };
}) => {
  const { productId } = searchParams;
  return <ProductValue productId={productId} />;
};

export default AddProductValuePage;
