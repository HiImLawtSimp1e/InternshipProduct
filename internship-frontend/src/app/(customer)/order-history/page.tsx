import OrderHistoryList from "@/components/shop/order-history/order-history-list";
import { cookies as nextCookies } from "next/headers";

const Orders = async ({ params }: { params: { page?: number } }) => {
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const { page } = params;
  let url = "";
  if (page == null || page <= 0) {
    url = "http://localhost:5000/api/Order";
  } else {
    url = `http://localhost:5000/api/Order?page=${page}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Thêm header Authorization
    },
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
