import OrderList from "@/components/dashboard/order/order-list";

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

  return <OrderList orders={result} pages={pages} currentPage={currentPage} />;
};

const OrdersPage = ({ searchParams }: { searchParams: { page?: number } }) => {
  const { page } = searchParams;

  // Render Orders component with params prop
  return <Orders params={{ page: page || undefined }} />;
};

export default OrdersPage;
