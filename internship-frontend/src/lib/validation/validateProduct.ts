export const validateProduct = (
  title: string,
  description: string,
  imageUrl: string,
  seoTitle: string,
  seoDescription: string,
  seoKeyworks: string
): [string[], boolean] => {
  const errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required.");
  }

  if (!description || description.trim().length === 0) {
    errors.push("Description is required.");
  }

  if (!imageUrl || imageUrl.trim().length === 0) {
    errors.push("Image URL is required.");
  }

  if (!seoTitle || seoTitle.trim().length === 0) {
    errors.push("SEO Title is required.");
  }

  if (!seoDescription || seoDescription.trim().length === 0) {
    errors.push("SEO Description is required.");
  }

  if (!seoKeyworks || seoKeyworks.trim().length === 0) {
    errors.push("SEO Keywords are required.");
  }

  return [errors, errors.length === 0];
};
