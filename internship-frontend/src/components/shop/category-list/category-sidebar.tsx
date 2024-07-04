import Link from "next/link";

interface IProps {
  categories: ICategory[];
}

const CategorySidebar = ({ categories }: IProps) => {
  return (
    <div className="mt-12 h-full transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-2 py-4 overflow-y-auto text-xl bg-gray-50 lg:text-base">
        <ul className="space-y-2 font-medium">
          {categories?.map((category: ICategory) => (
            <li key={category.id}>
              <Link
                href={{
                  pathname: `/product`,
                  query: { category: category.slug },
                }}
                className="flex items-center p-4 text-gray-900 rounded-lg hover:bg-gray-100 group lg:p-2"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {category.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategorySidebar;
