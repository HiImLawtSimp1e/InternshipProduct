interface IProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeyworks: string;
  createdAt: string;
  modifiedAt: string;
  categoryId: string;
  productVariants: IProductVariant[];
}

interface IProductVariant {
  productId: string;
  productType: {
    id: string;
    name: string;
  };
  productTypeId: string;
  price: number;
  originalPrice: number;
}
