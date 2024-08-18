export enum OrderState {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
}

const orderStateMapping: Record<number, string> = {
  [OrderState.Pending]: "Pending",
  [OrderState.Processing]: "Processing",
  [OrderState.Shipped]: "Shipped",
  [OrderState.Delivered]: "Delivered",
  [OrderState.Cancelled]: "Cancelled",
};

const cssTagFieldMapping: Record<number, string> = {
  [OrderState.Pending]: "tag-pending",
  [OrderState.Processing]: "tag-processing",
  [OrderState.Shipped]: "tag-shipped",
  [OrderState.Delivered]: "tag-delivered",
  [OrderState.Cancelled]: "tag-cancelled",
};

export const mapOrderState = (state: number): string => {
  const result = orderStateMapping[state];
  if (!result) {
    throw new Error(`Unknown state: ${state}`);
  }
  return result;
};

export const mapCssTagField = (state: number): string => {
  const result = cssTagFieldMapping[state];
  if (!result) {
    throw new Error(`Unknown state: ${state}`);
  }
  return result;
};
