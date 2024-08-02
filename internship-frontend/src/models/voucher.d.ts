// customer shopping models

interface IVoucher {
  id: string;
  code: string;
  voucherName: string;
  isDiscountPercent: boolean;
  discountValue: number;
  minOrderCondition: number;
  maxDiscountValue: number;
}

// admin models

interface IAdminVoucher {
  id: string;
  code: string;
  voucherName: string;
  isDiscountPercent: boolean;
  discountValue: number;
  minOrderCondition: number;
  maxDiscountValue: number;
  quantity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface IVoucherItem {
  id: string;
  code: string;
  voucherName: string;
  isDiscountPercent: boolean;
  discountValue: number;
  minOrderCondition: number;
  maxDiscountValue: number;
  quantity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
