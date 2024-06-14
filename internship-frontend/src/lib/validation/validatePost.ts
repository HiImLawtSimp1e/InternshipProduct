export const validatePost = (
  title: string,
  content: string,
  seoTitle: string,
  seoDescription: string,
  seoKeyworks: string
): [string[], boolean] => {
  const errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required.");
  }

  if (!content || content.trim().length === 0) {
    errors.push("Content is required.");
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
