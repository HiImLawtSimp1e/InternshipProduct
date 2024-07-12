import { formatDate } from "@/lib/format/format";

interface IProps {
  customer: IOrderCustomer;
}

const OrderDetailCustomer = ({ customer }: IProps) => {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <div className="text-2xl mb-2 font-bold text-white uppercase">
          Invoice #{customer.invoiceCode}
        </div>
        <div className="mb-2 ml-auto text-lg text-gray-400">
          Order Date: {formatDate(customer.orderCreatedAt)}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="text-2xl mb-2 font-bold text-white uppercase">
          Bill to
        </div>
        <address className="my-6 text-lg flex flex-col gap-2 text-gray-400">
          <p>Name: {customer.fullName}</p>
          <p>Email: {customer.email}</p>
          <p>Address: {customer.address}</p>
          <p>Phone: {customer.phone}</p>
        </address>
      </div>
    </div>
  );
};

export default OrderDetailCustomer;
