import Link from "next/link";
import Image from "next/image";

interface IProps {
  categories: ICategory[];
}

const ShopCategoryList = ({ categories }: IProps) => {
  return (
    <div className="mt-12 px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((category: ICategory) => (
          <Link
            href={`/list/${category.slug}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={category.id}
          >
            <div className="relative bg-slate-100 w-full h-96">
              <Image
                src={"/category.png"}
                alt=""
                fill
                sizes="20vw"
                className="object-cover hover:opacity-70 transition-opacity easy duration-500"
              />
            </div>
            <h1 className="mt-4 text-center font-light text-lg tracking-wide hover:opacity-70">
              {category.title}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopCategoryList;
