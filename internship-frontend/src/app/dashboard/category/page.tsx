import CategoryList from "@/components/dashboard/category/category-list";

const Categories = async () => {
  const res = await fetch(`http://localhost:5000/api/Category/admin`, {
    method: "GET",
    next: { tags: ["categoryListAdmin"] },
  });

  const responseData: ApiResponse<ICategory[]> = await res.json();
  const { data, success, message } = responseData;

  return <CategoryList categories={data} />;
};

const ProductTypesPage = () => {
  return <Categories />;
};

export default ProductTypesPage;
