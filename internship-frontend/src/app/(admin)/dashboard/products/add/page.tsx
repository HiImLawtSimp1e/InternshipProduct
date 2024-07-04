import AddProductForm from "@/components/dashboard/product/add-product-form";

const Product = async () => {
  const categorySelectRes = await fetch(
    `http://localhost:5000/api/Category/select`,
    {
      method: "GET",
    }
  );

  const categorySelect: ApiResponse<ICategorySelect[]> =
    await categorySelectRes.json();

  // console.log(categorySelect.data);

  const productTypeSelectRes = await fetch(
    `http://localhost:5000/api/ProductType/select`,
    {
      method: "GET",
    }
  );

  const productTypeSelect: ApiResponse<IProductType[]> =
    await productTypeSelectRes.json();

  // console.log(categorySelect.data);

  return (
    <AddProductForm
      categorySelect={categorySelect.data}
      typeSelect={productTypeSelect.data}
    />
  );
};

const AddProductPage = () => {
  return (
    <>
      <Product />
    </>
  );
};
export default AddProductPage;
