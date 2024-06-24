import AddProductImageForm from "@/components/dashboard/product-image/add-image-form";

const AddProductImagePage = ({
  searchParams,
}: {
  searchParams: { productId: string };
}) => {
  const { productId } = searchParams;
  return (
    <>
      <AddProductImageForm productId={productId} />
    </>
  );
};
export default AddProductImagePage;
