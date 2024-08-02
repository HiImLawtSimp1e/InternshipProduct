interface IOrder {
  id: string;
  invoiceCode: string;
  totalPrice: number;
  state: number;
  discountValue: number;
  createdAt: string;
  modifiedAt: string;
}

interface IOrderDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  invoiceCode: string;
  discountValue: number;
  orderCreatedAt: string;
}

interface IOrderItem {
  productId: string;
  productTypeId: string;
  productTitle: string;
  productTypeName: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  quantity: number;
}
