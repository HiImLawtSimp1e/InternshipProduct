import UpdateProductAttributeForm from "@/components/dashboard/product-attribute/update-product-attribute-form";

const ProductType = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/ProductAttribute/${id}`, {
    method: "GET",
    next: { tags: ["productAttributeDetail"] },
  });

  const productAttribute: ApiResponse<IProductAttribute> = await res.json();

  return <UpdateProductAttributeForm attribute={productAttribute.data} />;
};

const UpdateProductAttributePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <ProductType id={id} />;
};

export default UpdateProductAttributePage;
