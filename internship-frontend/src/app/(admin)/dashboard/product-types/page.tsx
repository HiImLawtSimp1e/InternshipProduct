import ProductTypeList from "@/components/dashboard/productType/product-type-list";

const ProductTypes = async ({ params }: { params: { page?: number } }) => {
  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/ProductType";
  } else {
    url = `http://localhost:5000/api/ProductType?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["productTypeList"] },
  });

  const responseData: ApiResponse<PagingParams<IProductType[]>> =
    await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage } = data;

  return (
    <ProductTypeList
      productTypes={result}
      pages={pages}
      currentPage={currentPage}
    />
  );
};

const ProductTypesPage = ({
  searchParams,
}: {
  searchParams: { page?: number };
}) => {
  const { page } = searchParams;
  return <ProductTypes params={{ page: page || undefined }} />;
};

export default ProductTypesPage;
