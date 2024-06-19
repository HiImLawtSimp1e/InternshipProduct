export const validatePost = (
  title: string,
  content: string,
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

  if (!content || content.trim().length === 0) {
    errors.push("Content is required.");
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
