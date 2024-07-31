import ShoppingCart from "@/components/shop/cart/shopping-cart";
import { cookies as nextCookies } from "next/headers";

const Carts = async () => {
  const cookieStore = nextCookies();
  const token = cookieStore.get("authToken")?.value || "";

  const res = await fetch("http://localhost:5000/api/Cart", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Thêm header Authorization
    },
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
