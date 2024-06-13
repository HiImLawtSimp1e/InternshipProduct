import { deleteCategory } from "@/action/categoryAction";
import TagFiled from "@/components/ui/tag";
import { formatDate } from "@/lib/format/format";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

interface IProps {
  categories: ICategory[];
}

const CategoryList = ({ categories }: IProps) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-end mb-5">
        <Link href="/dashboard/category/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Category
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Slug</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: ICategory, index) => (
            <tr key={category.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{category.title}</td>
              <td className="px-4 py-2">{category.slug}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={category.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={category.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">{formatDate(category.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(category.modifiedAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/category/${category.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <button className="m-1 px-5 py-2 bg-red-500 text-white rounded">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CategoryList;
