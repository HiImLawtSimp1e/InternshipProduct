// Define the validateVariant function
export const validateVariant = (
  productTypeId: string,
  price: number | null,
  originalPrice: number | null
): [string[], boolean] => {
  const errors: string[] = [];

  // Validate product type ID
  if (!productTypeId) {
    errors.push("Product type is required.");
  }

  // Validate price
  if (price === null) {
    errors.push("Price is required.");
  } else if (price <= 0) {
    errors.push("Price must be greater than zero.");
  }

  // Validate original price
  if (originalPrice !== null && originalPrice <= 0) {
    errors.push("Original price must be greater than zero.");
  }

  // Return errors and a boolean indicating validity
  return [errors, errors.length === 0];
};
