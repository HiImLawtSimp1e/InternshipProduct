export const validateVariant = (
  productTypeId: string,
  price: number | null,
  originalPrice: number | null,
  quantity?: number | null
): [string[], boolean] => {
  const errors: string[] = [];

  // Validate product type ID
  if (!productTypeId) {
    errors.push("Product type is required.");
  }

  // Validate price
  if (price === null || price === undefined) {
    errors.push("Price is required.");
  } else if (price < 1000) {
    errors.push("Price must be an integer and greater than or equal to 1000.");
  }

  // Validate original price
  if (
    originalPrice !== undefined &&
    originalPrice != null &&
    originalPrice < 0
  ) {
    errors.push("Original price must be greater than or equal to 0.");
  }
  if (
    originalPrice !== null &&
    originalPrice !== undefined &&
    originalPrice !== 0
  ) {
    if (originalPrice < 1000) {
      errors.push(
        "Original price must be an integer and greater than or equal to 1000."
      );
    }
  }

  // Validate that original price is greater than or equal to price, except when original price is 0
  if (
    originalPrice !== null &&
    originalPrice !== undefined &&
    price !== null &&
    price !== undefined
  ) {
    if (originalPrice !== 0 && originalPrice < price) {
      errors.push("Original price must be greater than or equal to the price.");
    }
  }

  // Validate quantity
  if (quantity != null && quantity != undefined && quantity < 0) {
    errors.push("Quantity must be an integer.");
  }

  // Return errors and a boolean indicating validity
  return [errors, errors.length === 0];
};
