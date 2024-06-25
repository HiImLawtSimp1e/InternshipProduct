"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface IProps {
  images: IProductImage[];
}

const ProductImages = ({ images }: IProps) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    images.map((image, index) => {
      if (image.isMain) {
        setIndex(index);
      }
    });
  }, [images]);
  return (
    <div className="">
      <div className="h-[500px] relative ">
        <Image
          src={images[index].imageUrl || "/product.png"}
          alt=""
          fill
          sizes="50vw"
          className="object-cover rounded-md"
        />
      </div>
      <div className="flex justify-between gap-4 mt-8">
        {images?.map((image, index) => {
          return (
            <div
              key={image.id}
              className="w-1/4 h-32 relative cursor-pointer"
              onClick={() => setIndex(index)}
            >
              <Image
                src={image.imageUrl}
                alt=""
                fill
                sizes="50vw"
                className="object-cover rounded-md"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImages;
