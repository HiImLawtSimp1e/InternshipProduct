interface IProps {
  productValues: IProductValue[];
}

const ProductDetailAttribute = ({ productValues }: IProps) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Attribute
            </th>
            <th scope="col" className="px-6 py-3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {productValues?.map((value: IProductValue) => (
            <tr key={value.productAttributeId} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {value.productAttribute.name}
              </th>
              <td className="px-6 py-4">{value.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetailAttribute;
