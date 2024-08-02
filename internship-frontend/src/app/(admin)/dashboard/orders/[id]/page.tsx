import OrderDetail from "@/components/dashboard/order/order-detail";
import OrderDetailCustomer from "@/components/dashboard/order/order-detail-customer";
import UpdateOrderDetail from "@/components/dashboard/order/update-order-detail";

const Order = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/Order/${id}`, {
    method: "GET",
    next: { tags: ["orderDetail"] },
  });

  const orderItems: ApiResponse<IOrderItem[]> = await res.json();

  const orderStateRes = await fetch(
    `http://localhost:5000/api/Order/admin/get-state/${id}`,
    {
      method: "GET",
      next: { tags: ["orderStateDetail"] },
    }
  );

  const orderState: ApiResponse<string> = await orderStateRes.json();

  return (
    <>
      <OrderDetail orderItems={orderItems.data} />
      <UpdateOrderDetail orderId={id} orderState={orderState.data} />
    </>
  );
};

const DetailCustomer = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/Order/detail/${id}`, {
    method: "GET",
    next: { tags: ["orderCustomerDetail"] },
  });

  const orderDetail: ApiResponse<IOrderDetail> = await res.json();

  return <OrderDetailCustomer orderDetail={orderDetail.data} />;
};

const OrderDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <DetailCustomer id={id} />
      <Order id={id} />
    </>
  );
};

export default OrderDetailPage;
