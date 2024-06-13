import ProductTypeList from "@/components/dashboard/productType/product-type-list";

const ProductTypes = async () => {
  const res = await fetch(`http://localhost:5000/api/ProductType`, {
    method: "GET",
    next: { tags: ["productTypeList"] },
  });

  const responseData: ApiResponse<IProductType[]> = await res.json();
  const { data, success, message } = responseData;

  return <ProductTypeList productTypes={data} />;
};

const ProductTypesPage = () => {
  return <ProductTypes />;
};

export default ProductTypesPage;
