export const validateAddProduct = (
  title: string,
  description: string,
  seoTitle: string,
  seoDescription: string,
  seoKeyworks: string,
  price: number | null,
  originalPrice: number | null
): [string[], boolean] => {
  const errors: string[] = [];
  const maxIntValue = 2147483647;

  if (!title || title.trim().length === 0) {
    errors.push("Product title is required.");
  } else if (title.trim().length < 2) {
    errors.push("Product title must have at least 2 characters.");
  }

  if (!description || description.trim().length === 0) {
    errors.push("Product description is required.");
  } else if (description.trim().length < 6) {
    errors.push("Product description must have at least 6 characters.");
  }

  if (seoTitle && seoTitle.trim().length > 70) {
    errors.push("SEO Title can't be longer than 70 characters.");
  }

  if (seoDescription && seoDescription.trim().length > 160) {
    errors.push("SEO Description can't be longer than 160 characters.");
  }

  if (seoKeyworks && seoKeyworks.trim().length > 100) {
    errors.push("SEO Keywords can't be longer than 100 characters.");
  }

  // Validate price
  if (price === null || price === undefined) {
    errors.push("Price is required.");
  } else if (price < 1000) {
    errors.push("Price must be an integer and greater than or equal to 1000.");
  } else if (price > maxIntValue) {
    errors.push(`Price cannot exceed ${maxIntValue}.`);
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
    } else if (originalPrice > maxIntValue) {
      errors.push(`Original price cannot exceed ${maxIntValue}.`);
    }
  }

  return [errors, errors.length === 0];
};

export const validateUpdateProduct = (
  title: string,
  description: string,
  seoTitle: string,
  seoDescription: string,
  seoKeyworks: string
): [string[], boolean] => {
  const errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push("Product title is required.");
  } else if (title.trim().length < 2) {
    errors.push("Product title must have at least 2 characters.");
  }

  if (!description || description.trim().length === 0) {
    errors.push("Product description is required.");
  } else if (description.trim().length < 6) {
    errors.push("Product description must have at least 6 characters.");
  }

  if (seoTitle && seoTitle.trim().length > 70) {
    errors.push("SEO Title can't be longer than 70 characters.");
  }

  if (seoDescription && seoDescription.trim().length > 160) {
    errors.push("SEO Description can't be longer than 160 characters.");
  }

  if (seoKeyworks && seoKeyworks.trim().length > 100) {
    errors.push("SEO Keywords can't be longer than 100 characters.");
  }

  return [errors, errors.length === 0];
};
