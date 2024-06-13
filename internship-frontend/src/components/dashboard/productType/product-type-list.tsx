import { MdAdd } from "react-icons/md";
import { formatDate } from "@/lib/format/format";
import Link from "next/link";
import { deleteType } from "@/action/productTypeAction";

interface IProps {
  productTypes: IProductType[];
}

const ProductTypeList = ({ productTypes }: IProps) => {
  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-end mb-5">
        <Link href="/dashboard/product-types/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Type
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((type: IProductType, index) => (
            <tr key={type.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{type.name}</td>
              <td className="px-4 py-2">{formatDate(type.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(type.modifiedAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/product-types/${type.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form action={deleteType}>
                    <input type="hidden" name="id" value={type.id} />
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

export default ProductTypeList;
