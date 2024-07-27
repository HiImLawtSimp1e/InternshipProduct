interface IOrder {
  id: string;
  invoiceCode: string;
  totalPrice: number;
  state: number;
  createdAt: string;
  modifiedAt: string;
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
