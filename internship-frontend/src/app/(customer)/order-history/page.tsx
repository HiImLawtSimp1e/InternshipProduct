import OrderHistoryList from "@/components/shop/order-history/order-history-list";

const Orders = async ({ params }: { params: { page?: number } }) => {
  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Order/admin";
  } else {
    url = `http://localhost:5000/api/Order/admin?page=${page}`;
  }
  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const responseData: ApiResponse<PagingParams<IOrder[]>> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  const { result, pages, currentPage } = data;

  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <OrderHistoryList
        orders={result}
        pages={pages}
        currentPage={currentPage}
      />
    </div>
  );
};

const OrderHistoryPages = ({
  searchParams,
}: {
  searchParams: { page?: number };
}) => {
  const { page } = searchParams;

  // Render Orders component with params prop
  return <Orders params={{ page: page || undefined }} />;
};

export default OrderHistoryPages;
