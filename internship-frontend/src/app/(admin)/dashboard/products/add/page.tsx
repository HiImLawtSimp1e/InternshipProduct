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

  console.log(categorySelect.data);

  return <AddProductForm categorySelect={categorySelect.data} />;
};

const AddProductPage = () => {
  return (
    <>
      <Product />
    </>
  );
};
export default AddProductPage;
