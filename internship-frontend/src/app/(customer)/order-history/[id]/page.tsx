import OrderHistoryDetail from "@/components/shop/order-history/order-detail";
import { cookies as nextCookies } from "next/headers";

const Order = async ({ id }: { id: string }) => {
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch(`http://localhost:5000/api/Order/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Thêm header Authorization
    },
    next: { tags: ["orderDetail"] },
  });

  const orderItems: ApiResponse<IOrderItem[]> = await res.json();

  const detailRes = await fetch(
    `http://localhost:5000/api/Order/detail/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Thêm header Authorization
      },
      next: { tags: ["orderCustomerDetail"] },
    }
  );

  const orderDetail: ApiResponse<IOrderDetail> = await detailRes.json();

  return (
    <OrderHistoryDetail
      orderItems={orderItems.data}
      orderDetail={orderDetail.data}
    />
  );
};

const OrderHistoryDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <Order id={id} />
    </>
  );
};

export default OrderHistoryDetailPage;
