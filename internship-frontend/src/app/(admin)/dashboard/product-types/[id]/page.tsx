import UpdateProductTypeForm from "@/components/dashboard/productType/update-product-type-form";

const ProductType = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/ProductType/${id}`, {
    method: "GET",
    next: { tags: ["productTypeDetail"] },
  });

  const productType: ApiResponse<IProductType> = await res.json();

  return <UpdateProductTypeForm type={productType.data} />;
};

const UpdateProductTypePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <ProductType id={id} />;
};

export default UpdateProductTypePage;
