import Image from "next/image";
import UpdateProductForm from "./update-product-form";

interface IProps {
  product: IProduct;
  categorySelect: ICategorySelect[];
}

const ProductDetail = ({ product, categorySelect }: IProps) => {
  return (
    <div className="container flex gap-8 mt-5">
      <div className="basis-1/4 bg-gray-700 p-4 rounded-lg font-bold">
        <div className="w-full h-72 relative rounded-lg overflow-hidden mb-4">
          <Image src={"/noavatar.png"} alt="" layout="fill" objectFit="cover" />
        </div>
        <div>{product.title}</div>
      </div>
      <div className="basis-3/4 bg-gray-700 p-4 rounded-lg">
        <UpdateProductForm product={product} categorySelect={categorySelect} />
      </div>
    </div>
  );
};
export default ProductDetail;
