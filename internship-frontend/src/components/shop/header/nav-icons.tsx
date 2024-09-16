"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import CartModal from "./cart-modal";
import { useCartStore } from "@/lib/store/useCartStore";
import {
  getAuthPublic,
  setLogoutPublic,
} from "@/services/auth-service/auth-service";
import { usePathname } from "next/navigation";

const NavIcons = () => {
  const { cartItems, counter, totalAmount, getCart } = useCartStore();
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const authToken = getAuthPublic();

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleProfile = () => {
    setIsCartOpen(false);
    setIsProfileOpen((prev) => !prev);
  };
  const handleCart = () => {
    setIsProfileOpen(false);
    setIsCartOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setIsProfileOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setIsCartOpen(false);
    }
  };

  const handleLogout = () => {
    setLogoutPublic();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (authToken) {
      getCart();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      <div className="relative cursor-pointer" onClick={handleCart}>
        <Image src="/cart.png" alt="" width={22} height={22} />
        {counter >= 1 && (
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-rose-400 rounded-full text-white text-sm flex items-center justify-center">
            {counter}
          </div>
        )}
      </div>
      {isCartOpen && (
        <div
          ref={cartRef}
          className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20"
        >
          <CartModal cartItems={cartItems} totalAmount={totalAmount} />
        </div>
      )}
      {isProfileOpen && (
        <div
          ref={profileRef}
          className="p-4 absolute flex flex-col gap-4 text-md rounded-md top-12 right-0 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
        >
          {authToken ? (
            <>
              <Link
                className="inline-block min-w-40 hover:opacity-60"
                href="/profile"
              >
                Profile
              </Link>
              <Link
                className="inline-block min-w-40 hover:opacity-60"
                href="/order-history"
              >
                My Order
              </Link>
              <Link
                className="inline-block min-w-40 hover:opacity-60"
                href="profile/change-password"
              >
                Change Password
              </Link>
              <div
                onClick={handleLogout}
                className="inline-block min-w-40 hover:opacity-60 cursor-pointer"
              >
                Logout
              </div>
            </>
          ) : (
            <>
              <Link
                className="inline-block min-w-40 hover:opacity-60"
                href={{
                  pathname: "/login",
                  query: { redirectUrl: encodeURIComponent(pathname) },
                }}
              >
                Login
              </Link>
              <Link
                className="inline-block min-w-40 hover:opacity-60"
                href="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavIcons;
