import CategoryList from "@/components/dashboard/category/category-list";

const Categories = async ({ params }: { params: { page?: number } }) => {
  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Category/admin";
  } else {
    url = `http://localhost:5000/api/Category/admin?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["categoryListAdmin"] },
  });

  const responseData: ApiResponse<PagingParams<ICategory[]>> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage } = data;

  return (
    <CategoryList categories={result} pages={pages} currentPage={currentPage} />
  );
};

const CategoiesPage = ({
  searchParams,
}: {
  searchParams: { page?: number };
}) => {
  const { page } = searchParams;
  return <Categories params={{ page: page || undefined }} />;
};

export default CategoiesPage;
