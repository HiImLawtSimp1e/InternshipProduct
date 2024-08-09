import CounterSaleCart from "./counter-sales-cart";
import CounterSalesOrderItem from "./counter-sales-order-item";
import CounterSalesProductList from "./counter-sales-product-list";

const CounterSales = () => {
  return (
    <div className="h-[200vh]">
      <>
        <div className="px-6 flex">
          <div className="rounded-lg basis-2/3">
            <CounterSalesProductList />
          </div>
          {/* Sub total */}
          <div className="rounded-lg basis-1/3">
            <CounterSaleCart />
          </div>
        </div>
      </>
    </div>
  );
};

export default CounterSales;
