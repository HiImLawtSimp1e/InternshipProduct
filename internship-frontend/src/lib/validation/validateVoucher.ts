export const validateVoucher = (
  voucherName: string,
  discountValue: number | null,
  minOrderCondition: number | null,
  maxDiscountValue: number | null,
  quantity: number | null,
  startDate: string,
  endDate: string,
  code: string,
  isDiscountPercent: boolean
): [string[], boolean] => {
  const errors: string[] = [];
  const maxIntValue = 2147483647;

  if (!code || code.trim().length === 0) {
    errors.push("The discount code is required.");
  } else if (code.trim().length < 2 || code.trim().length > 25) {
    errors.push("The discount code must be between 2 and 25 characters.");
  }

  if (!voucherName || voucherName.trim().length === 0) {
    errors.push("Voucher name is required.");
  } else if (voucherName.trim().length < 2 || voucherName.trim().length > 50) {
    errors.push("Voucher name must be between 2 and 50 characters.");
  }

  if (discountValue === null) {
    errors.push("Discount value is required.");
  }

  if (isDiscountPercent === true) {
    if (discountValue !== null && (discountValue < 1 || discountValue > 80)) {
      errors.push("Discount percent must be between 1% and 80%");
    }
  } else {
    if (discountValue !== null && discountValue < 10000) {
      errors.push("Discount value at least is 10000.");
    } else if (discountValue !== null && discountValue > maxIntValue) {
      errors.push(`Discount value cannot exceed ${maxIntValue}.`);
    }
  }

  if (minOrderCondition !== null && minOrderCondition < 0) {
    errors.push("Min order condition must be a non-negative integer.");
  } else if (minOrderCondition !== null && minOrderCondition > maxIntValue) {
    errors.push(`Min order condition cannot exceed ${maxIntValue}.`);
  }

  if (maxDiscountValue !== null && maxDiscountValue < 0) {
    errors.push("Max discount value must be a non-negative integer.");
  } else if (maxDiscountValue !== null && maxDiscountValue > maxIntValue) {
    errors.push(`Max discount value cannot exceed ${maxIntValue}.`);
  }

  if (quantity !== null && quantity < 0) {
    errors.push("Quantity must be a non-negative integer.");
  }

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (isNaN(startDateObj.getTime())) {
    errors.push("Start date is invalid.");
  }

  if (isNaN(endDateObj.getTime())) {
    errors.push("End date is invalid.");
  }

  if (startDateObj >= endDateObj) {
    errors.push("End date must be after start date.");
  }

  return [errors, errors.length === 0];
};
