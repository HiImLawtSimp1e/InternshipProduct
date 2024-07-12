export enum OrderState {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
}

export const mapOrderState = (state: number): string => {
  switch (state) {
    case OrderState.Pending:
      return "Pending";
    case OrderState.Processing:
      return "Processing";
    case OrderState.Shipped:
      return "Shipped";
    case OrderState.Delivered:
      return "Delivered";
    case OrderState.Cancelled:
      return "Cancelled";
    default:
      throw new Error(`Unknown state: ${state}`);
  }
};
