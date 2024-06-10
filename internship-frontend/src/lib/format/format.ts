import { format } from "date-fns";

export const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
};

export const formatProductType = (productType: string) => {
  return productType + ":";
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy");
};
