import { deleteProduct } from "@/action/productAction";
import Search from "@/components/ui/search";
import TagFiled from "@/components/ui/tag";
import {
  formatDate,
  formatPrice,
  formatProductType,
} from "@/lib/format/format";
import Link from "next/link";
import { MdAdd } from "react-icons/md";

interface IProps {
  products: IProduct[];
  pages: number;
  currentPage: number;
}

const ProductList = ({ products, pages, currentPage }: IProps) => {
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="bg-gray-800 p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search products..." />
        <Link href="/dashboard/products/add">
          <button className="p-2 flex items-center justify-center mb-5 bg-purple-600 text-white rounded">
            <MdAdd />
            Add New Product
          </button>
        </Link>
      </div>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Slug</th>
            <th className="px-4 py-2">Variant</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Modified At</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product: IProduct, index) => (
            <tr key={product.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2">{product.title}</td>
              <td className="px-4 py-2">{product.slug}</td>
              <td className="px-4 py-2">
                {product.productVariants.map(
                  (variant: IProductVariant, index) => (
                    <div key={index}>
                      {formatProductType(variant.productType.name)}
                    </div>
                  )
                )}
              </td>
              <td className="px-4 py-2">
                {product.productVariants.map(
                  (variant: IProductVariant, index) => (
                    <div key={index}>{formatPrice(variant.price)}</div>
                  )
                )}
              </td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={product.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={product.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">{formatDate(product.createdAt)}</td>
              <td className="px-4 py-2">{formatDate(product.modifiedAt)}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <button className="m-1 px-5 py-2 bg-teal-500 text-white rounded">
                      View
                    </button>
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
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
      <ul className="mt-5 float-right inline-flex -space-x-px text-sm">
        <li>
          <button
            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 rounded-s-lg bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 ${
              currentPage === 1
                ? "cursor-not-allowed pointer-events-none opacity-50"
                : ""
            }`}
          >
            <Link href={currentPage === 1 ? "#" : `?page=${currentPage - 1}`}>
              Previous
            </Link>
          </button>
        </li>
        {pageNumbers.map((page) => (
          <li key={page}>
            <Link
              href={
                currentPage === page ? "#" : `/dashboard/products?page=${page}`
              }
            >
              <button
                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                  currentPage === page
                    ? "border border-gray-700 bg-gray-700 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {page}
              </button>
            </Link>
          </li>
        ))}
        <li>
          <button
            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 rounded-e-lg bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 ${
              currentPage === pages
                ? "cursor-not-allowed pointer-events-none opacity-50"
                : ""
            }`}
          >
            <Link href={`?page=${currentPage + 1}`}>Next</Link>
          </button>
        </li>
      </ul>
    </div>
  );
};
export default ProductList;
