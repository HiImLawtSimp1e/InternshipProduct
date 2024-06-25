const CustomizeProduct = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* {product.originalPrice === product.price ? (
        <h2 className="font-medium text-2xl">${product.price}</h2>
      ) : (
        <div className="flex items-center gap-4">
          <h3 className="text-xl text-gray-500 line-through">
            ${product.originalPrice}
          </h3>
          <h2 className="font-medium text-2xl">${product.price}</h2>
        </div>
      )} */}
      <div className="h-[2px] bg-gray-100" />
      <div className="font-medium">Choose a color</div>
      <ul className="flex items-center gap-3">
        <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-red-500">
          <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </li>
        <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-blue-500"></li>
        <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-not-allowed relative bg-white">
          <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </li>
      </ul>
      <div className="font-medium">Choose a size</div>
      <ul className="flex items-center gap-3">
        <li className="ring-1 ring-green-600 text-white bg-green-600 rounded-md py-1 px-4 text-sm cursor-pointer">
          <p>Small</p>
        </li>
        <li className="ring-1 ring-blue-600 text-white bg-blue-600 rounded-md py-1 px-4 text-sm cursor-pointer">
          Medium
        </li>
        <li className="ring-1 ring-violet-600 text-white bg-violet-600 rounded-md py-1 px-4 text-sm opacity-45 cursor-not-allowed">
          Large
        </li>
      </ul>
    </div>
  );
};
export default CustomizeProduct;
