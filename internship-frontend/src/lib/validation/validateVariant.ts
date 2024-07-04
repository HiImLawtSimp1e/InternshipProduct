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
  if (price === null) {
    errors.push("Price is required.");
  } else if (price < 1000) {
    errors.push("Price must be an integer and greater than or equal to 1000.");
  }

  // Validate original price
  if (originalPrice === null) {
    errors.push("Original price is required.");
  } else if (originalPrice < 1000) {
    errors.push(
      "Original price must be an integer and greater than or equal to 1000."
    );
  }

  // Validate that original price is greater than or equal to price
  if (originalPrice !== null && price !== null && originalPrice < price) {
    errors.push("Original price must be greater than or equal to the price.");
  }

  // Validate quantity
  if (quantity != null && quantity != undefined && quantity < 0) {
    errors.push("Quantity must be an integer.");
  }

  // Return errors and a boolean indicating validity
  return [errors, errors.length === 0];
};
