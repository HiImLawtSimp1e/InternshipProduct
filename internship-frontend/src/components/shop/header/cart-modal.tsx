"use client";

const CartModal = () => {
  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      <>
        <h2 className="text-xl">Shopping Cart</h2>
        {/* LIST */}
        <div className="flex flex-col gap-8">
          {/* ITEM */}
          <div>Item here</div>
        </div>
        {/* BOTTOM */}
        <div className="">
          <div className="flex items-center justify-between font-semibold">
            <span className="">Subtotal</span>
            <span className="">$2000</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 mb-4">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="flex justify-between text-sm">
            <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
              View Cart
            </button>
            <button className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75">
              Checkout
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default CartModal;
