import ShopProductDetail from "@/components/shop/product-detail/product-detail";
import api from "@/services/axios/instance-api";

const Product = async ({ productSlug }: { productSlug: string }) => {
  const res = await fetch(`http://localhost:5000/api/Product/${productSlug}`, {
    method: "GET",
    next: { tags: ["shopProductDetail"] },
  });

  const product: ApiResponse<IProduct> = await res.json();

  // const res = await api.get<ApiResponse<IProduct>>(`/Product/${productSlug}`);

  // const product = res.data;

  // console.log(product.data);

  return <ShopProductDetail product={product.data} />;
};

const ProductDetailPage = ({ params }: { params: { productSlug: string } }) => {
  const { productSlug } = params;
  return <Product productSlug={productSlug} />;
};

export default ProductDetailPage;
