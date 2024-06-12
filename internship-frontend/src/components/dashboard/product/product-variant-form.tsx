import TagFiled from "@/components/ui/tag";
import Link from "next/link";

interface IProps {
  variants: IProductVariant[];
}

const ProductVariantForm = ({ variants }: IProps) => {
  return (
    <>
      <table className="w-full text-left text-gray-400">
        <thead className="bg-gray-700 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">Product Type</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Original Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant: IProductVariant) => (
            <tr key={variant.productId} className="border-b border-gray-700">
              <td className="px-4 py-2">{variant.productType.name}</td>
              <td className="px-4 py-2">{variant.price}</td>
              <td className="px-4 py-2">{variant.originalPrice}</td>
              <td className="px-4 py-2">
                <TagFiled
                  cssClass={variant.isActive ? "bg-lime-900" : "bg-red-700"}
                  context={variant.isActive ? "Active" : "Passive"}
                />
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button className="m-1 px-5 py-2 bg-blue-600 text-white rounded">
                    Edit
                  </button>
                  <form>
                    <input type="hidden" name="id" value={variant.productId} />
                    <input
                      type="hidden"
                      name="id"
                      value={variant.productTypeId}
                    />
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
    </>
  );
};

export default ProductVariantForm;
