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

  const cartItems: ApiResponse<ICartItem[]> = await res.json();
  // console.log(response.data);

  const addressRes = await fetch("http://localhost:5000/api/Address/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Thêm header Authorization
    },
    next: { tags: ["mainAddress"] },
  });

  const address: ApiResponse<IAddress> = await addressRes.json();
  // console.log(response.data);

  return <ShoppingCart cartItems={cartItems.data} address={address.data} />;
};

const ShoppingCartPage = () => {
  return <Carts />;
};

export default ShoppingCartPage;
