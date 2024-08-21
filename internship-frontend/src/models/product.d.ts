interface IProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeyworks: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  categoryId: string;
  productVariants: IProductVariant[];
  productImages?: IProductImage[];
  productValues: IProductValues[];
}

interface IProductVariant {
  productId: string;
  productType: IProductType;
  productTypeId: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isActive: boolean;
}

interface IProductType {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

interface IProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
  productId: string;
  isActive: boolean;
}

interface IProductAttribute {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
}

interface IProductValue {
  productId: string;
  productAttribute: IProductAttribute;
  productAttributeId: string;
  value: string;
  isActive: boolean;
}
