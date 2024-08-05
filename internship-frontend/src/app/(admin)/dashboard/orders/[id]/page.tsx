import OrderDetail from "@/components/dashboard/order/order-detail";
import UpdateOrderDetail from "@/components/dashboard/order/update-order-detail";
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

  const orderStateRes = await fetch(
    `http://localhost:5000/api/Order/admin/get-state/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Thêm header Authorization
      },
      next: { tags: ["orderStateDetail"] },
    }
  );

  const orderState: ApiResponse<string> = await orderStateRes.json();

  const ordetDetailRes = await fetch(
    `http://localhost:5000/api/Order/detail/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Thêm header Authorization
      },
      next: { tags: ["orderCustomerDetail"] },
    }
  );

  const orderDetail: ApiResponse<IOrderDetail> = await ordetDetailRes.json();

  return (
    <>
      <OrderDetail
        orderDetail={orderDetail.data}
        orderItems={orderItems.data}
      />
      <UpdateOrderDetail orderId={id} orderState={orderState.data} />
    </>
  );
};

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <Order id={id} />
    </>
  );
};

export default OrderDetailPage;
