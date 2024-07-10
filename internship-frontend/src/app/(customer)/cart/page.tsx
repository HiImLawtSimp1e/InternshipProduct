import ShoppingCart from "@/components/shop/cart/shopping-cart";

const Carts = async () => {
  const res = await fetch("http://localhost:5000/api/Cart", {
    method: "GET",
    next: { tags: ["shoppingCart"] },
  });

  const responseData: ApiResponse<ICartItem[]> = await res.json();
  const { data, success, message } = responseData;
  // console.log(responseData);
  return <ShoppingCart cartItems={data} />;
};

const ShoppingCartPage = () => {
  return <Carts />;
};

export default ShoppingCartPage;
