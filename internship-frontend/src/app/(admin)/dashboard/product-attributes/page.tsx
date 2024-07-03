import ProductAttributeList from "@/components/dashboard/product-attribute/product-attribute-list";

const ProductAttributes = async ({ params }: { params: { page?: number } }) => {
  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/ProductAttribute";
  } else {
    url = `http://localhost:5000/api/ProductAttribute?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    next: { tags: ["productAttributeList"] },
  });

  const responseData: ApiResponse<PagingParams<IProductAttribute[]>> =
    await res.json();
  const { data, success, message } = responseData;
  console.log(responseData);
  const { result, pages, currentPage } = data;

  return (
    <ProductAttributeList
      productAttributes={result}
      pages={pages}
      currentPage={currentPage}
    />
  );
};

const ProductAttributesPage = ({
  searchParams,
}: {
  searchParams: { page?: number };
}) => {
  const { page } = searchParams;
  return <ProductAttributes params={{ page: page || undefined }} />;
};

export default ProductAttributesPage;
