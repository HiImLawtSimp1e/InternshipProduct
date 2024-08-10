"use client";

import CounterSalesAddress from "./counter-sales-address";
import CounterSaleCart from "./counter-sales-cart";
import CounterSalesProductList from "./counter-sales-product-list";

const CounterSales = () => {
  return (
    <div className="h-[250vh]">
      <>
        <div className="px-6 flex">
          <div className="flex flex-col gap-2 mx-2 basis-2/3 h-[250vh]">
            <CounterSalesAddress />
            <CounterSalesProductList />
          </div>
          {/* Sub total */}
          <div className="basis-1/3 h-[250vh]">
            <CounterSaleCart />
          </div>
        </div>
      </>
    </div>
  );
};

export default CounterSales;
