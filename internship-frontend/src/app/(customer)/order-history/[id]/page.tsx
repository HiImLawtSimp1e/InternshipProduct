import OrderHistoryDetail from "@/components/shop/order-history/order-detail";

const Order = async ({ id }: { id: string }) => {
  const res = await fetch(`http://localhost:5000/api/Order/admin/${id}`, {
    method: "GET",
    next: { tags: ["orderDetail"] },
  });

  const orderItems: ApiResponse<IOrderItem[]> = await res.json();

  const customerRes = await fetch(
    `http://localhost:5000/api/Order/admin/customer/${id}`,
    {
      method: "GET",
      next: { tags: ["orderCustomerDetail"] },
    }
  );

  const orderCustomer: ApiResponse<IOrderCustomer> = await customerRes.json();

  return (
    <OrderHistoryDetail
      orderItems={orderItems.data}
      orderCustomer={orderCustomer.data}
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
