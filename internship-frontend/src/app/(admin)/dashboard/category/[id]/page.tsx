import UpdateCategoryForm from "@/components/dashboard/category/update-category-form";

const Category = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/Category/admin/${id}`, {
    method: "GET",
    next: { tags: ["categoryDetail"] },
  });

  const category: ApiResponse<ICategory> = await res.json();

  return <UpdateCategoryForm category={category.data} />;
};

const UpdateCategoryPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return <Category id={id} />;
};

export default UpdateCategoryPage;
