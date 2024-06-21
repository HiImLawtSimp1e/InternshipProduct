"use client";

import Image from "next/image";
import UpdateProductForm from "./update-product-form";
import ProductVariantForm from "./product-variant-form";
import { create } from "@/action/action";

interface IProps {
  product: IProduct;
  categorySelect: ICategorySelect[];
}

const ProductDetail = ({ product, categorySelect }: IProps) => {
  return (
    <div className="container mt-5">
      <div className="flex gap-8">
        <div className="basis-1/4 bg-gray-700 p-4 rounded-lg font-bold">
          <div className="w-full h-72 relative rounded-lg overflow-hidden mb-4">
            <Image
              src={product.imageUrl?.toString() || "/noavatar.png"}
              alt=""
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>{product.title}</div>
          <form action={create}>
            <label>Select an image to upload</label>
            <input id="image" type="file" name="image" />
            <button className="bg-blue-700" type="submit">
              Upload
            </button>
          </form>
        </div>
        <div className="basis-3/4 bg-gray-700 p-4 rounded-lg">
          <UpdateProductForm
            product={product}
            categorySelect={categorySelect}
          />
        </div>
      </div>
      <div className="mt-5">
        <ProductVariantForm
          productId={product.id}
          variants={product.productVariants}
        />
      </div>
    </div>
  );
};
export default ProductDetail;
