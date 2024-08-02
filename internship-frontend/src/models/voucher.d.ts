interface IVoucher {
  id: string;
  code: string;
  voucherName: string;
  isDiscountPercent: boolean;
  discountValue: number;
  minOrderCondition: number;
  maxDiscountValue: number;
}
